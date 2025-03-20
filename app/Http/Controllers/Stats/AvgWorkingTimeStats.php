<?php

namespace App\Http\Controllers\Stats;

use App\Http\Controllers\Stats\BaseStatsController;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Log;

/**
 * This controller returns, monthly, the average working time calculated as fulfill_date - request_date (when both are available).
 * It is possible to filter by request year, library, institution and material_type
 */
class AvgWorkingTimeStats extends BaseStatsController
{
  public function __invoke(Request $request)
  {
    $validated = $request->validate([
      'year' => 'integer|min:2020|max:' . date('Y'),
      'library_id' => 'sometimes|integer|exists:libraries,id',
      'institution_id' => 'sometimes|integer|exists:institutions,id',
      'material_type' => 'sometimes|integer|min:1|max:5'
    ]);

    $year = $validated['year'] ?? null;
    $library_id = $validated['library_id'] ?? null;
    $institution_id = $validated['institution_id'] ?? null;
    $material_type = $validated['material_type'] ?? null;

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

    if ($material_type) {
      $mustClauses[] = ['term' => ['reference.material_type' => $material_type]];
    }

    if ($query_id) {
      $mustClauses[] = [
        'bool' => [
          'should' => [
            ['term' => [$borrowing_query_condition => $query_id]],
            ['term' => [$lending_query_condition => $query_id]],
          ],
          'minimum_should_match' => 1
        ]
      ];
    }

    $filterBorrowing = $query_id ? ['term' => [$borrowing_query_condition => $query_id]] : ['match_all' => new \stdClass()];
    $filterLending = $query_id ? ['term' => [$lending_query_condition => $query_id]] : ['match_all' => new \stdClass()];

    $params = [
      'index' => 'docdel_requests',
      'body'  => [
        'size' => 0,
        'query' => [
          'bool' => ['must' => $mustClauses]
        ],
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


    $response = $this->client->search($params);

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
