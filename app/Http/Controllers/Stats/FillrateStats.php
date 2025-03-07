<?php

namespace App\Http\Controllers\Stats;

use App\Http\Controllers\Stats\BaseStatsController;
use Illuminate\Http\Request;

/**
 * This controller handles the calculation of fill rate statistics.
 * 
 * The fill rate is calculated using the following formula:
 *  fill_rate = (received - trashed) / (total - new - in_progress - canceled - direct)
 * 
 * The query can be optionally filtered by:
 * - Year (`year`): Only include requests withing the specified year.
 * - Library ID (`library_id`): Only include requests from a specific library.
 */
class FillrateStats extends BaseStatsController
{
  public function __invoke(Request $request)
  {
    // Validate optional parameters 'year' and 'library_id'
    $validated = $request->validate([
      'year' => 'sometimes|integer|min:2020|max:' . date('Y'),
      'library_id' => 'sometimes|integer|exists:libraries,id',
    ]);

    $year = $validated['year'] ?? null;
    $library_id = $validated['library_id'] ?? null;

    // Retrieve status mappings
    // $statusMap = $this->getStatusMap('borrowing');
    // $newStatuses = $statusMap[0];
    // $inProgressStatuses = $statusMap[1];
    // $receivedStatuses = $statusMap[2];
    // $canceledStatuses = $statusMap[4];

    // Elasticsearch query
    $query = [
      'index' => 'docdel_requests',
      'body'  => [
        'size' => 0,
        'query' => [
          'bool' => [
            'filter' => [
              ['term' => ['forward' => 0]],
              // Additional filters here, if needed
            ]
          ]
        ],
        'aggs' => [
          'all_docs' => [
            'filters' => [
              'filters' => [
                'all' => ['match_all' => (object)[]]
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
              'fill_rate' => [
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
          ]
        ]
      ]
    ];

    // If a year is provided, add it to the query
    if ($year) {
      $query['body']['query']['bool']['must'][] = [
        'range' => [
          'request_date' => [
            'gte' => "{$year}-01-01",
            'lte' => "{$year}-12-31",
            'format' => 'yyyy-MM-dd'
          ]
        ]
      ];
    }

    // If a library is provided, add it to the query
    if ($library_id) {
      $query['body']['query']['bool']['must'][] = [
        'term' => [
          'borrowing_library.id' => $library_id
        ]
      ];
    }

    // Execute the query on the Elasticsearch client
    $response = $this->client->search($query);
    $result = [];
    $result["fill_rate"] = $response["aggregations"]["all_docs"]["buckets"]["all"]["fill_rate"]["value"];

    return response()->json($result);
  }
}
