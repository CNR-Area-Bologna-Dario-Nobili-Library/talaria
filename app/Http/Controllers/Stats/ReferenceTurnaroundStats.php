<?php

namespace App\Http\Controllers\Stats;

use App\Helper\StatsHelper;
use App\Http\Controllers\Stats\BaseStatsController;
use Exception;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Log;

/**
 * This controller returns the average turnaround time for references, grouped by reference.material_type.
 * It is possible to filter by request year and (borrowing) library_id, (borrowing) institution_id or (borrowing) country_id.
 */
class ReferenceTurnaroundStats extends BaseStatsController
{
  public function __invoke(Request $request)
  {
    $create_query = StatsHelper::createQuery($request);
    $query = $create_query['query'];
    $agg_info = $create_query['agg_info'];

    $filterBorrowing = array_values(array_filter([
      $agg_info['borrowing_field'] && $agg_info['query_id'] !== null
        ? ['term' => [$agg_info['borrowing_field'] => $agg_info['query_id']]]
        : null
    ]));

    // $query has filters by year, library_id, institution_id or country_id and material_type
    $final_query = $query;

    // Let's add filters to the query to get only borrowing data
    if (!empty($filterBorrowing)) {
      $final_query = ['bool' => ['must' => $filterBorrowing]];
    }

    $params = [
      'index' => 'docdel_requests',
      'body'  => [
        'size' => 0,
        'query' => $final_query,
        'aggs' => [
          'group_by_material_type' => [
            'terms' => [
              'field' => 'reference.material_type'
            ],
            'aggs' => [
              'group_by_reference' => [
                'terms' => [
                  'field' => 'reference.id',
                  'size' => 10000
                ],
                'aggs' => [
                  'oldest_request_date' => [
                    'min' => ['field' => 'request_date']
                  ],
                  'newest_fulfill_date' => [
                    'max' => ['field' => 'fulfill_date']
                  ],
                  'turnaround_time' => [
                    'bucket_script' => [
                      'buckets_path' => [
                        'oldest' => 'oldest_request_date',
                        'newest' => 'newest_fulfill_date'
                      ],
                      'script' => "
                                    if (params.oldest == null || params.newest == null) {
                                        return null;
                                    }
                                    return (params.newest - params.oldest) / 1000 / 60 / 60 / 24;
                                  "
                    ]
                  ]
                ]
              ],
              'average_turnaround' => [
                'avg_bucket' => [
                  'buckets_path' => 'group_by_reference>turnaround_time'
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
      Log::error("Error in reference turnaround stats: " . $e->getMessage());
      throw new Exception("Statistics are momentarily unavailable, please try again later.");
    }

    $averages = [];
    foreach ($response['aggregations']['group_by_material_type']['buckets'] as $bucket) {
      $averages[$bucket['key']] = $bucket['average_turnaround']['value'] ?? null;
    }

    return response()->json($averages);
  }
}
