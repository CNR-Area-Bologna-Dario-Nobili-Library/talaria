<?php

namespace App\Http\Controllers\Stats;

use App\Helper\StatsHelper;
use App\Http\Controllers\Stats\BaseStatsController;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

/**
 * This controller handles the calculation of fill rate statistics.
 * 
 * The fill rate is calculated using the following formula:
 *  fill_rate = (received - trashed) / (total - new - in_progress - canceled - direct)
 * 
 * The query can be optionally filtered by:
 * - Year (`year`): Only include requests withing the specified year.
 * - Library ID (`library_id`): Only include requests from a specific library.
 * - Institution ID (`institution_id`): Only include requests from all libraries of a specific institution.
 * - Country ID (`country_id`): Only include requests from all libraries of a specific country.
 */
class FillrateStats extends BaseStatsController
{
  public function __invoke(Request $request)
  {
    $create_query = StatsHelper::createQuery($request);
    $query = $create_query['query'];
    $agg_info = $create_query['agg_info'];

    $filterBorrowing = array_values(array_filter([
      $agg_info['borrowing_field'] && $agg_info['query_id'] !== null
        ? ['term' => [$agg_info['borrowing_field'] => $agg_info['query_id']]]
        : null,
      ['term' => ['forward' => 0]],
    ]));

    $filterLending = $agg_info['lending_field'] && $agg_info['query_id'] !== null
      ? ['term' => [$agg_info['lending_field'] => $agg_info['query_id']]]
      : ['match_all' => new \stdClass()];

    // Elasticsearch query
    $params = [
      'index' => 'docdel_requests',
      'body'  => [
        'size' => 0,
        'query' => $query,
        'aggs' => [
          'borrowing_stats' => [
            'filters' => [
              'filters' => [
                'borrowing' => [
                  'bool' => [
                    'must' => $filterBorrowing
                  ]
                ]
              ]
            ],
            'aggs' => [
              'total' => [
                'value_count' => [
                  'field' => 'id'
                ]
              ],
              'new' => [
                'filter' => [
                  'term' => ['aggregated_borrowing_status.keyword' => "New"]
                ]
              ],
              'in_progress' => [
                'filter' => [
                  'term' => ['aggregated_borrowing_status.keyword' => "In progress"]
                ]
              ],
              'not_received' => [
                'filter' => [
                  'term' => ['aggregated_borrowing_status.keyword' => "Not received"]
                ]
              ],
              'not_received_fulfilled' => [
                'filter' => [
                  'term' => ['aggregated_borrowing_status.keyword' => "Not received but fulfilled by lender"]
                ]
              ],
              'canceled' => [
                'filter' => [
                  'term' => ['aggregated_borrowing_status.keyword' => "Canceled"]
                ]
              ],
              'received' => [
                'filter' => [
                  'term' => ['aggregated_borrowing_status.keyword' => "Received"]
                ]
              ],
              'direct' => [
                'filter' => [
                  'term' => ['aggregated_borrowing_status.keyword' => "Patron direct request"]
                ]
              ],
              'borrowing_fill_rate' => [
                'bucket_script' => [
                  'buckets_path' => [
                    'total'       => 'total',
                    'new'         => 'new._count',
                    'in_progress' => 'in_progress._count',
                    'canceled'    => 'canceled._count',
                    'received'    => 'received._count',
                    'direct'      => 'direct._count'
                  ],
                  'script' => "def denominator = params.total - params.new - params.in_progress - params.canceled - params.direct; denominator > 0 ? (params.received) / denominator : 0"
                ]
              ]
            ]
          ],
          'lending_stats' => [
            'filters' => [
              'filters' => [
                'lending' => $filterLending
              ]
            ],
            'aggs' => [
              'fulfilled' => [
                'filter' => [
                  'term' => ['aggregated_lending_status.keyword' => "Fulfilled"]
                ]
              ],
              'unfilled' => [
                'filter' => [
                  'term' => ['aggregated_lending_status.keyword' => "Not fulfilled"]
                ]
              ],
              'lending_fill_rate' => [
                'bucket_script' => [
                  'buckets_path' => [
                    'fulfilled' => 'fulfilled._count',
                    'unfilled'  => 'unfilled._count'
                  ],
                  'script' => "def denominator = params.fulfilled + params.unfilled ; denominator > 0 ? (params.fulfilled) / denominator : 0"
                ]
              ]
            ]
          ]
        ]
      ]
    ];

    try {
      // Execute the query on the Elasticsearch client
      $response = $this->client->search($params);
    } catch (Exception $e) {
      Log::error("Error in fill rate stats: " . $e->getMessage());
      throw new Exception("Statistics are momentarily unavailable, please try again later.");
    }


    $borrowingBucket = $response["aggregations"]["borrowing_stats"]["buckets"]["borrowing"] ?? [];
    $lendingBucket   = $response["aggregations"]["lending_stats"]["buckets"]["lending"] ?? [];

    // If no documents, default to 0.
    $borrowingValue = $borrowingBucket["borrowing_fill_rate"]["value"] ?? null;
    $lendingValue   = $lendingBucket["lending_fill_rate"]["value"] ?? null;

    $borrowingFillRate = $borrowingValue !== null ? $borrowingValue * 100 : 0;
    $lendingFillRate   = $lendingValue !== null ? $lendingValue * 100 : 0;

    $tmpBorrowingResp = $response["aggregations"]["borrowing_stats"]["buckets"]["borrowing"];
    $tmpLendingResp   = $response["aggregations"]["lending_stats"]["buckets"]["lending"];

    $result = [];
    $result["total_borrowing"] = $tmpBorrowingResp["received"]["doc_count"] + $tmpBorrowingResp["not_received"]["doc_count"] + $tmpBorrowingResp["not_received_fulfilled"]["doc_count"];
    $result["total_lending"] = $tmpLendingResp["unfilled"]["doc_count"] + $tmpLendingResp["fulfilled"]["doc_count"];
    $result["borrowing_fill_rate"] = $borrowingFillRate;
    $result["borrowing_fill_number"] = $tmpBorrowingResp["received"]["doc_count"];
    $result["borrowing_unfill_rate"] = $result["total_borrowing"] !== 0 ? 100 - $borrowingFillRate : 0;
    $result["borrowing_unfill_number"] = $tmpBorrowingResp["not_received"]["doc_count"] + $tmpBorrowingResp["not_received_fulfilled"]["doc_count"];
    $result["lending_fill_rate"] = $lendingFillRate;
    $result["lending_fill_number"] = $tmpLendingResp["fulfilled"]["doc_count"];
    $result["lending_unfill_rate"] = $result["total_lending"] !== 0 ? 100 - $lendingFillRate : 0;
    $result["lending_unfill_number"] = $tmpLendingResp["unfilled"]["doc_count"];

    return response()->json($result);
  }
}
