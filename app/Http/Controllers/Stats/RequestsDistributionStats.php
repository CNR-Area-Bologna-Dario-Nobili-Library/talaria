<?php

namespace App\Http\Controllers\Stats;

use App\Http\Controllers\Stats\BaseStatsController;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Log;

/**
 * This controller handles the requests distribution statistics.
 * Returns the quantity of requests by aggregated status
 */
class RequestsDistributionStats extends BaseStatsController
{
  public function __invoke(Request $request)
  {
    $validated = $request->validate([
      'year' => 'sometimes|integer|min:2020|max:' . date('Y'),
      'library_id' => 'sometimes|integer|exists:libraries,id',
      'material_type' => 'sometimes|integer|min:1|max:5',
      // 'status' => 'sometimes|integer|min:0',
      // 'fulfill_type' => 'sometimes|integer|min:1|nullable',
      // 'notfulfill_type' => 'sometimes|integer|min:1|nullable'
    ]);

    $year = $validated['year'] ?? null;
    $library_id = $validated['library_id'] ?? null;
    $material_type = $validated['material_type'] ?? null;
    // $status = $validated['status'] ?? null;
    // $fulfill_type = $validated['fulfill_type'] ?? null;
    // $notfulfill_type = $validated['notfulfill_type'] ?? null;

    $globalFilters = [];

    if ($year) {
      $globalFilters[] = [
        'range' => [
          'request_date' => [
            'gte' => "{$year}-01-01",
            'lte' => "{$year}-12-31",
            'format' => 'yyyy-MM-dd'
          ]
        ]
      ];
    }
    if ($material_type) {
      $globalFilters[] = ['term' => ['reference.material_type' => $material_type]];
    }

    $query = count($globalFilters) > 0 ? ['bool' => ['filter' => $globalFilters]] : ['match_all' => (object)[]];

    // Query by library id
    if ($library_id) {
      $borrowingAggregation = [
        'filter' => [
          'term' => ['borrowing_library.id' => $library_id]
        ],
        'aggs' => [
          'statuses' => [
            'terms' => [
              'field' => 'aggregated_borrowing_status.keyword'
            ],
            'aggs' => [
              'by_material_type' => [
                'terms' => [
                  'field' => 'reference.material_type'
                ]
              ]
            ]
          ]
        ]
      ];

      $lendingAggregation = [
        'filter' => [
          'term' => ['lending_library.id' => $library_id]
        ],
        'aggs' => [
          'statuses' => [
            'terms' => [
              'field' => 'aggregated_lending_status.keyword'
            ],
            'aggs' => [
              'by_material_type' => [
                'terms' => [
                  'field' => 'reference.material_type'
                ]
              ]
            ]
          ]
        ]
      ];

      // Borrowing fulfill method / reason unfilled distribution
      $borrowingFulfilledFilter = [
        'bool' => [
          'must' => [
            ['term' => ['aggregated_borrowing_status.keyword' => 'Received']],
            ['term' => ['borrowing_library.id' => $library_id]],
          ]
        ]
      ];

      $borrowingUnfilledFilter = [
        'bool' => [
          'must' => [
            ['term' => ['aggregated_borrowing_status.keyword' => 'Not received']],
            ['term' => ['borrowing_library.id' => $library_id]],
          ]
        ]
      ];

      // Lending fulfill method / reason unfilled distribution
      $lendingFulfilledFilter = [
        'bool' => [
          'must' => [
            ['term' => ['aggregated_lending_status.keyword' => 'Fulfilled']],
            ['term' => ['lending_library.id' => $library_id]],
          ]
        ]
      ];

      $lendingUnfilledFilter = [
        'bool' => [
          'must' => [
            ['term' => ['aggregated_fulfilled_status.keyword' => 'Not fulfilled']],
            ['term' => ['lending_library.id' => $library_id]],
          ]
        ]
      ];
    } else {
      // If no library is provided
      $borrowingAggregation = [
        'terms' => [
          'field' => 'aggregated_borrowing_status.keyword'
        ],
        'aggs' => [
          'by_material_type' => [
            'terms' => [
              'field' => 'reference.material_type'
            ]
          ]
        ]
      ];

      $lendingAggregation = [
        'terms' => [
          'field' => 'aggregated_lending_status.keyword'
        ],
        'aggs' => [
          'by_material_type' => [
            'terms' => [
              'field' => 'reference.material_type'
            ]
          ]
        ]
      ];

      // Borrowing fulfill method / reason unfilled distribution
      $borrowingFulfilledFilter = ['term' => ['aggregated_borrowing_status.keyword' => 'Received']];
      $borrowingUnfilledFilter = ['term' => ['aggregated_borrowing_status.keyword' => 'Not received']];
      // Lending fulfill method / reason unfilled distribution
      $lendingFulfilledFilter = ['term' => ['aggregated_lending_status.keyword' => 'Fulfilled']];
      $lendingUnfilledFilter = ['term' => ['aggregated_lending_status.keyword' => 'Not fulfilled']];
    }

    $params = [
      'index' => 'docdel_requests',
      'body'  => [
        'size' => 0,
        'query' => $query,
        'aggs' => [
          'by_borrowing_status' => $borrowingAggregation,
          'by_lending_status' => $lendingAggregation,
          // Aggregation for fulfill_type on fulfilled requests
          'borrowing_fulfilled_distribution' => [
            'filter' => $borrowingFulfilledFilter,
            'aggs' => [
              'by_fulfill_type' => [
                'terms' => [
                  'field' => 'fulfill_type'
                ],
                'aggs' => [
                  'by_material_type' => [
                    'terms' => [
                      'field' => 'reference.material_type'
                    ]
                  ]
                ]
              ]
            ]
          ],
          // Aggregation for notfulfill_type on unfilled requests
          'borrowing_unfilled_distribution' => [
            'filter' => $borrowingUnfilledFilter,
            'aggs' => [
              'by_notfulfill_type' => [
                'terms' => [
                  'field' => 'notfulfill_type'
                ],
                'aggs' => [
                  'by_material_type' => [
                    'terms' => [
                      'field' => 'reference.material_type'
                    ]
                  ]
                ]
              ]
            ]
          ],
          'lending_fulfilled_distribution' => [
            'filter' => $lendingFulfilledFilter,
            'aggs' => [
              'by_fulfill_type' => [
                'terms' => [
                  'field' => 'fulfill_type'
                ],
                'aggs' => [
                  'by_material_type' => [
                    'terms' => [
                      'field' => 'reference.material_type'
                    ]
                  ]
                ]
              ]
            ]
          ],
          'lending_unfilled_distribution' => [
            'filter' => $lendingUnfilledFilter,
            'aggs' => [
              'by_notfulfill_type' => [
                'terms' => [
                  'field' => 'notfulfill_type'
                ],
                'aggs' => [
                  'by_material_type' => [
                    'terms' => [
                      'field' => 'reference.material_type'
                    ]
                  ]
                ]
              ]
            ]
          ]
        ]
      ]
    ];

    // Execute the query with your Elasticsearch client.
    $response = $this->client->search($params);

    $result = [
      "total" => $response['hits']['total'],
      "by_borrowing_status" => $library_id ? $response['aggregations']['by_borrowing_status']['statuses'] : $response['aggregations']['by_borrowing_status'],
      "by_lending_status" => $library_id ? $response['aggregations']['by_lending_status']['statuses'] : $response['aggregations']['by_lending_status'],
      "borrowing_fulfilled_distribution" => $response['aggregations']['borrowing_fulfilled_distribution']['by_fulfill_type'],
      "borrowing_unfilled_distribution"  => $response['aggregations']['borrowing_unfilled_distribution']['by_notfulfill_type'],
      "lending_fulfilled_distribution" => $response['aggregations']['lending_fulfilled_distribution']['by_fulfill_type'],
      "lending_unfilled_distribution"  => $response['aggregations']['lending_unfilled_distribution']['by_notfulfill_type'],
    ];

    return response()->json($result);
  }
}
