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
 */
class FillrateStats extends BaseStatsController
{
  public function __invoke(Request $request)
  {
    // Validate optional parameters 'year' and 'library_id'
    $validated = $request->validate([
      'year' => 'sometimes|integer|min:2020|max:' . date('Y'),
      'library_id' => 'sometimes|integer|exists:libraries,id',
      'institution_id' => 'sometimes|integer|exists:institutions,id'
    ]);

    $year = $validated['year'] ?? null;
    $library_id = $validated['library_id'] ?? null;
    $institution_id = $validated['institution_id'] ?? null;

    $borrowing_query_condition = "borrowing_library" . ($institution_id !== null && $library_id === null ? ".institution" : "") . ".id";
    $lending_query_condition = "lending_library" . ($institution_id !== null && $library_id === null ? ".institution" : "") . ".id";
    $query_id = ($library_id !== null) ? $library_id : ($institution_id !== null ? $institution_id : null); // when both are present, library_id has more priority than institution_id

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
    $borrowingFillRate = ($borrowingBucket["borrowing_fill_rate"]["value"] ?? 0) * 100;
    $lendingFillRate   = ($lendingBucket["lending_fill_rate"]["value"] ?? 0) * 100;

    $result = [];
    $result["borrowing_fill_rate"] = $borrowingFillRate;
    $result["borrowing_unfill_rate"] = 100 - $borrowingFillRate;
    $result["lending_fill_rate"] = $lendingFillRate;
    $result["lending_unfill_rate"] = 100 - $lendingFillRate;

    return response()->json($result);
  }
}
