<?php

namespace App\Http\Controllers\Stats;

use App\Helper\StatsHelper;
use App\Http\Controllers\Stats\BaseStatsController;
use Exception;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Log;

/**
 * This controller returns, monthly, the average working time calculated as fulfill_date - request_date (when both are available).
 * It is possible to filter by request year, library, institution, country and material_type
 */
class AvgWorkingTimeStats extends BaseStatsController
{
  public function __invoke(Request $request)
  {
    $create_query = StatsHelper::createQuery($request);

    $query = $create_query['query'];
    $agg_info = $create_query['agg_info'];

    $filterBorrowing = $agg_info['borrowing_field']
    ? ['term' => [$agg_info['borrowing_field'] => $agg_info['query_id']]]
    : ['match_all' => new \stdClass()];

    $filterLending = $agg_info['lending_field']
    ? ['term' => [$agg_info['lending_field'] => $agg_info['query_id']]]
    : ['match_all' => new \stdClass()];

    $params = [
      'index' => 'docdel_requests',
      'body'  => [
        'size' => 0,
        'query' => $query,
        'aggs' => [
          'requests_per_year' => [
            'date_histogram' => [
              'field' => 'request_date',
              'calendar_interval' => 'year',
              'format' => 'yyyy',
              'min_doc_count' => 1
            ],
            'aggs' => [
              'requests_per_month' => [
                'date_histogram' => [
                  'field' => 'request_date',
                  'calendar_interval' => 'month',
                  'format' => 'yyyy-MM',
                  'min_doc_count' => 1
                ],
                'aggs' => [
                  'borrowing_avg_working_time' => [
                    'filter' => $filterBorrowing,
                    'aggs' => [
                      'avg_working_time' => [
                        'avg' => [
                          'script' => [
                            'source' => "if (doc['fulfill_date'].size() == 0 || doc['request_date'].size() == 0) { return null; } else { return (doc['fulfill_date'].value.millis - doc['request_date'].value.millis); }",
                            'lang'   => 'painless'
                          ]
                        ]
                      ]
                    ]
                  ],
                  'lending_avg_working_time' => [
                    'filter' => $filterLending,
                    'aggs' => [
                      'avg_working_time' => [
                        'avg' => [
                          'script' => [
                            'source' => "if (doc['fulfill_date'].size() == 0 || doc['request_date'].size() == 0) { return null; } else { return (doc['fulfill_date'].value.millis - doc['request_date'].value.millis); }",
                            'lang'   => 'painless'
                          ]
                        ]
                      ]
                    ]
                  ]
                ]
              ],
              // Pipeline aggregation -> average of borrowing monthly averages.
              'yearly_borrowing_avg' => [
                'avg_bucket' => [
                  'buckets_path' => 'requests_per_month>borrowing_avg_working_time>avg_working_time'
                ]
              ],
              // Pipeline aggregation -> average of lending monthly averages.
              'yearly_lending_avg' => [
                'avg_bucket' => [
                  'buckets_path' => 'requests_per_month>lending_avg_working_time>avg_working_time'
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
      Log::error("Error in avg working time stats: " . $e->getMessage());
      throw new Exception("Statistics are momentarily unavailable, please try again later.");
    }

    $averages = [];
    foreach ($response['aggregations']['requests_per_year']['buckets'] as $yearBucket) {
      $year = $yearBucket['key_as_string'];
      $averages[$year]['yearly_borrowing'] = $yearBucket['yearly_borrowing_avg'];
      $averages[$year]['yearly_lending'] = $yearBucket['yearly_lending_avg'];
      foreach ($yearBucket['requests_per_month']['buckets'] as $monthBucket) {
        $averages[$year][$monthBucket['key_as_string']] = [
          "borrowing" => $monthBucket['borrowing_avg_working_time']['avg_working_time']['value'],
          "lending"   => $monthBucket['lending_avg_working_time']['avg_working_time']['value'],
        ];
      }
    }

    return response()->json($averages);
  }
}
