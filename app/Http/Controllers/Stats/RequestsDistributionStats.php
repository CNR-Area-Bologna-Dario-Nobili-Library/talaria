<?php

namespace App\Http\Controllers\Stats;

use App\Helper\StatsHelper;
use App\Http\Controllers\Stats\BaseStatsController;
use Exception;
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

  // Helper function that creates a term query or a match_all query
  function makeFieldTerm($field, $value) {
    return $field && $value !== null ? ['term' => [$field => $value]] : ['match_all' => new \stdClass()];
  }

  public function __invoke(Request $request)
  {
    $create_query = StatsHelper::createQuery($request);

    $query = $create_query['query'];
    $agg_info = $create_query['agg_info'];

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

    $borrowingBase = $agg_info['borrowing_field'];
    $borrowValue = $agg_info['query_id'];

    $borrowingFulfilledFilter = [
      'bool' => [
        'must' => array_filter([
          ['term' => ['aggregated_borrowing_status.keyword' => 'Received']],
          $this->makeFieldTerm($borrowingBase, $borrowValue),
        ])
      ]
    ];

    $borrowingUnfilledFilter = [
      'bool' => [
        'must' => array_filter([
          ['term' => ['aggregated_borrowing_status.keyword' => 'Not received']],
          $this->makeFieldTerm($borrowingBase, $borrowValue),
        ])
      ]
    ];

    $lendingBase = $agg_info['lending_field'];
    $lendValue = $agg_info['query_id'];

    $lendingFulfilledFilter = [
      'bool' => [
        'must' => array_filter([
          ['term' => ['aggregated_lending_status.keyword' => 'Fulfilled']],
          $this->makeFieldTerm($lendingBase, $lendValue),
        ])
      ]
    ];

    $lendingUnfilledFilter = [
      'bool' => [
        'must' => array_filter([
          ['term' => ['aggregated_lending_status.keyword' => 'Not fulfilled']],
          $this->makeFieldTerm($lendingBase, $lendValue),
        ])
      ]
    ];

    $borrowingStatusFilter = $this->makeFieldTerm($borrowingBase, $borrowValue);
    $lendingStatusFilter = $this->makeFieldTerm($lendingBase, $lendValue);

    $params = [
      'index' => 'docdel_requests',
      'body'  => [
        'size' => 0,
        'query' => $query,
        'aggs' => [
          'by_borrowing_status' => [
            'filter' => $borrowingStatusFilter,
            'aggs' => [
              'borrowing_status' => $borrowingAggregation
            ],
          ],
          'by_lending_status' => [
            'filter' => $lendingStatusFilter,
            'aggs' => [
              'lending_status' => $lendingAggregation
            ],
          ],
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

    try {
      $response = $this->client->search($params);
    } catch (Exception $e) {
      Log::error("Error in requests distribution stats: " . $e->getMessage());
      throw new Exception("Statistics are momentarily unavailable, please try again later.");
    }

    // Filter by_borrowing_status output
    $borrowing_aggregation = $this->transformAggregation(
      $response['aggregations']['by_borrowing_status']['borrowing_status'],
      'by_material_type'
    );
    $borrowing_shown_statuses = ['New', 'In progress', 'Received', 'Not received', 'Canceled', 'Reiterated', 'Not received but fulfilled by lender'];

    // Filter by_lending_status output
    $lending_aggregation = $this->transformAggregation(
      $response['aggregations']['by_lending_status']['lending_status'],
      'by_material_type'
    );
    $lending_shown_statuses = ['In progress', 'Fulfilled', 'Not fulfilled', 'Canceled'];

    $filtered_borrowing = array_values(array_filter($borrowing_aggregation, function ($item) use ($borrowing_shown_statuses) {
      return in_array($item['key'], $borrowing_shown_statuses);
    }));

    $filtered_lending = array_values(array_filter($lending_aggregation, function ($item) use ($lending_shown_statuses) {
      return in_array($item['key'], $lending_shown_statuses);
    }));

    $result = [
      'total_borrowing_requests' => array_sum(array_column($filtered_borrowing, 'count')),
      'by_borrowing_status' => $filtered_borrowing,

      'total_lending_requests' => array_sum(array_column($filtered_lending, 'count')),
      'by_lending_status' => $filtered_lending,

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
