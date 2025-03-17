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
  /**
   * Transform an aggregation’s buckets to a simpler structure.
   */
  function transformAggregation(array $agg, string $nestedKey): array
  {
    $result = [];
    if (!isset($agg['buckets'])) {
      return $result;
    }
    foreach ($agg['buckets'] as $bucket) {
      $item = [
        'key'   => $bucket['key'],
        'count' => $bucket['doc_count']
      ];
      // If the bucket has a nested aggregation (e.g., by_material_type),
      // convert that to a key => count mapping.
      if (isset($bucket[$nestedKey]) && isset($bucket[$nestedKey]['buckets'])) {
        $materialTypes = [];
        foreach ($bucket[$nestedKey]['buckets'] as $subBucket) {
          $materialTypes[(string)$subBucket['key']] = $subBucket['doc_count'];
        }
        $item['material_types'] = $materialTypes;
      }
      $result[] = $item;
    }
    return $result;
  }

  public function __invoke(Request $request)
  {
    $validated = $request->validate([
      'year' => 'sometimes|integer|min:2020|max:' . date('Y'),
      'library_id' => 'sometimes|integer|exists:libraries,id',
      'institution_id' => 'sometimes|integer|exists:institutions,id',
      'material_type' => 'sometimes|integer|min:1|max:5',
    ]);

    $year = $validated['year'] ?? null;
    $library_id = $validated['library_id'] ?? null;
    $institution_id = $validated['institution_id'] ?? null;
    $material_type = $validated['material_type'] ?? null;

    $borrowing_query_condition = "borrowing_library" . ($institution_id !== null && $library_id === null ? ".institution" : "") . ".id";
    $lending_query_condition = "lending_library" . ($institution_id !== null && $library_id === null ? ".institution" : "") . ".id";
    $query_id = ($library_id !== null) ? $library_id : ($institution_id !== null ? $institution_id : null); // when both are present, library_id has more priority than institution_id

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

    // Query by library id or institution id
    if ($query_id) {
      $borrowingAggregation = [
        'filter' => [
          'term' => [$borrowing_query_condition => $query_id]
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
          'term' => [$lending_query_condition => $query_id]
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
            ['term' => [$borrowing_query_condition => $query_id]],
          ]
        ]
      ];

      $borrowingUnfilledFilter = [
        'bool' => [
          'must' => [
            ['term' => ['aggregated_borrowing_status.keyword' => 'Not received']],
            ['term' => [$borrowing_query_condition => $query_id]],
          ]
        ]
      ];

      // Lending fulfill method / reason unfilled distribution
      $lendingFulfilledFilter = [
        'bool' => [
          'must' => [
            ['term' => ['aggregated_lending_status.keyword' => 'Fulfilled']],
            ['term' => [$lending_query_condition => $query_id]],
          ]
        ]
      ];

      $lendingUnfilledFilter = [
        'bool' => [
          'must' => [
            ['term' => ['aggregated_fulfilled_status.keyword' => 'Not fulfilled']],
            ['term' => [$lending_query_condition => $query_id]],
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

    // Filter by_borrowing_status output
    $borrowing_aggregation = $this->transformAggregation(
      $query_id
        ? $response['aggregations']['by_borrowing_status']['statuses']
        : $response['aggregations']['by_borrowing_status'],
      'by_material_type'
    );
    $borrowing_shown_statuses = ['New', 'In progress', 'Received', 'Not received', 'Canceled', 'Reiterated', 'Not received but fulfilled by lender'];

    // Filter by_lending_status output
    $lending_aggregation = $this->transformAggregation(
      $query_id
        ? $response['aggregations']['by_lending_status']['statuses']
        : $response['aggregations']['by_lending_status'],
      'by_material_type'
    );
    $lending_shown_statuses = ['In progress', 'Fulfilled', 'Not fulfilled', 'Canceled'];

    $result = [
      'total' => $response['hits']['total']['value'],
      'by_borrowing_status' => array_values(array_filter($borrowing_aggregation, function ($item) use ($borrowing_shown_statuses) {
        return in_array($item['key'], $borrowing_shown_statuses);
      })),
      'by_lending_status' => array_values(array_filter($lending_aggregation, function ($item) use ($lending_shown_statuses) {
        return in_array($item['key'], $lending_shown_statuses);
      })),
      'borrowing_fulfilled_distribution' => $this->transformAggregation(
        $response['aggregations']['borrowing_fulfilled_distribution']['by_fulfill_type'],
        'by_material_type'
      ),
      'borrowing_unfilled_distribution'  => $this->transformAggregation(
        $response['aggregations']['borrowing_unfilled_distribution']['by_notfulfill_type'],
        'by_material_type'
      ),
      'lending_fulfilled_distribution' => $this->transformAggregation(
        $response['aggregations']['lending_fulfilled_distribution']['by_fulfill_type'],
        'by_material_type'
      ),
      'lending_unfilled_distribution'  => $this->transformAggregation(
        $response['aggregations']['lending_unfilled_distribution']['by_notfulfill_type'],
        'by_material_type'
      ),
    ];

    return response()->json($result);
  }
}
