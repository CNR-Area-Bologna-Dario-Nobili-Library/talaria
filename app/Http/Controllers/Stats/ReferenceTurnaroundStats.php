<?php

namespace App\Http\Controllers\Stats;

use App\Http\Controllers\Stats\BaseStatsController;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Log;

/**
 * This controller returns the average turnaround time for references, grouped by reference.material_type.
 * It is possible to filter by request year and (borrowing) library_id or (borrowing) institution_id.
 */
class ReferenceTurnaroundStats extends BaseStatsController
{
  public function __invoke(Request $request)
  {
    $validated = $request->validate([
      'year' => 'sometimes|integer|min:2020|max:' . date('Y'),
      'library_id' => 'sometimes|integer|exists:libraries,id',
      'institution_id' => 'sometimes|integer|exists:institutions,id',
    ]);

    $year = $validated['year'] ?? null;
    $borrowing_library_id = $validated['library_id'] ?? null;
    $institution_id = $validated['institution_id'] ?? null;

    $borrowing_query_condition = "borrowing_library" . ($institution_id !== null && $borrowing_library_id === null ? ".institution" : "") . ".id";
    $query_id = ($borrowing_library_id !== null) ? $borrowing_library_id : ($institution_id !== null ? $institution_id : null); // when both are present, library_id has more priority than institution_id

    $mustClauses = [];

    // Filter by year (optional)
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

    // Filter by borrowing library or borrowing institution (optional)
    if ($query_id) {
      $mustClauses[] = ['term' => [$borrowing_query_condition => $query_id]];
    }

    $params = [
      'index' => 'docdel_requests',
      'body'  => [
        'size' => 0,
        'query' => [
          'bool' => ['must' => $mustClauses]
        ],
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

    $response = $this->client->search($params);

    $averages = [];
    foreach ($response['aggregations']['group_by_material_type']['buckets'] as $bucket) {
      $averages[$bucket['key']] = $bucket['average_turnaround']['value'] ?? null;
    }

    return response()->json($averages);
  }
}
