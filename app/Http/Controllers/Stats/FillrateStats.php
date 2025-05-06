<?php

namespace App\Http\Controllers\Stats;

use App\Http\Controllers\Stats\BaseStatsController;
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
    // Validate optional parameters 'year' and 'library_id'
    $validated = $request->validate([
      'year' => 'sometimes|integer|min:2020|max:' . date('Y'),
      'library_id' => 'sometimes|integer|exists:libraries,id',
      'institution_id' => 'sometimes|integer|exists:institutions,id',
      'country_id' => 'sometimes|integer|exists:countries,id',
      // 'library_id' => 'sometimes|integer',
      // 'institution_id' => 'sometimes|integer',
      // 'country_id' => 'sometimes|integer',
    ]);

    $year = $validated['year'] ?? null;
    $library_id = $validated['library_id'] ?? null;
    $institution_id = $validated['institution_id'] ?? null;
    $country_id = $validated['country_id'] ?? null;

    $borrowing_query_condition = null;
    $lending_query_condition = null;
    $query_id = null;

    // Priority: Library >> Institution >> Country
    if ($library_id) {
      $borrowing_query_condition = "borrowing_library.id";
      $lending_query_condition = "lending_library.id";
      $query_id = $library_id;
    } else if ($institution_id) {
      $borrowing_query_condition = "borrowing_library.institution.id";
      $lending_query_condition = "lending_library.institution.id";
      $query_id = $institution_id;
    } else if ($country_id) {
      $borrowing_query_condition = "borrowing_library.country.id";
      $lending_query_condition = "lending_library.country.id";
      $query_id = $country_id;
    }

    $mustClauses = [];

    if ($year) {
      $mustClauses[] = [
        'range' => [
          'request_date' => [
            'gte' => "{$year}-01-01",
            'lte' => "{$year}-12-31",
            'format' => 'yyyy-MM-dd'
          ]
        ]
      ];
    }

    $filterBorrowing = [];
    if ($query_id !== null) {
      $filterBorrowing[] = ['term' => [$borrowing_query_condition => $query_id]];
    }
    $filterBorrowing[] = ['term' => ['forward' => 0]];
    $filterLending = $query_id ? ['term' => [$lending_query_condition => $query_id]] : ['match_all' => new \stdClass()];

    // Elasticsearch query
    $query = [
      'index' => 'docdel_requests',
      'body'  => [
        'size' => 0,
        'query' => [
          'bool' => [
            'must' => $mustClauses
          ]
        ],
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

    // Execute the query on the Elasticsearch client
    $response = $this->client->search($query);
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
    $result["borrowing_unfill_rate"] = $borrowingValue !== null ? 100 - $borrowingFillRate : 0;
    $result["lending_fill_rate"] = $lendingFillRate;
    $result["lending_unfill_rate"] = $lendingValue !== null ? 100 - $lendingFillRate : 0;

    return response()->json($result);
  }
}
