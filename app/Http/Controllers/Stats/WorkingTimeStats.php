<?php

namespace App\Http\Controllers\Stats;

use App\Http\Controllers\Stats\BaseStatsController;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Log;

/**
 * This controller returns the working time of a request split between "within a day", "within a week", "more than a week".
 * It is possible to filter by year, library_id, institution_id, country_id or material_type.
 */
class WorkingTimeStats extends BaseStatsController
{
  public function __invoke(Request $request)
  {
    $validated = $request->validate([
      'year' => 'sometimes|integer|min:2020|max:' . date('Y'),
      'library_id' => 'sometimes|integer|exists:libraries,id',
      'institution_id' => 'sometimes|integer|exists:institutions,id',
      'country_id' => 'sometimes|integer|exists:countries,id',
      'material_type' => 'sometimes|integer|min:1|max:5',
      // 'library_id' => 'sometimes|integer',
      // 'institution_id' => 'sometimes|integer',
      // 'country_id' => 'sometimes|integer'
    ]);

    $year = $validated['year'] ?? null;
    $library_id = $validated['library_id'] ?? null;
    $institution_id = $validated['institution_id'] ?? null;
    $country_id = $validated['country_id'] ?? null;
    $material_type = $validated['material_type'] ?? null;

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
      'body' => [
        'size' => 0, // No data returned, only aggregations
        'query' => [
          'bool' => ['must' => $mustClauses]
        ],
        'aggs' => [
          'borrowing_stats' => [
            'filter' => $filterBorrowing,
            'aggs' => [
              'working_time_buckets' => [
                'terms' => [
                  'script' => [
                    'source' => "
                                      def requestDate = doc.containsKey('request_date') && doc['request_date'].size() > 0 ? doc['request_date'].value.toInstant().toEpochMilli() : null;
                                      def fulfillDate = doc.containsKey('fulfill_date') && doc['fulfill_date'].size() > 0 ? doc['fulfill_date'].value.toInstant().toEpochMilli() : null;
  
                                      if (requestDate == null) return null;
                                      if (fulfillDate == null) return null;
  
                                      def duration = (fulfillDate - requestDate) / 1000 / 60 / 60 / 24; // Convert to days
  
                                      if (duration <= 1) return 'Within a day';
                                      else if (duration <= 7) return 'Within a week';
                                      else return 'Longer than a week';
                                  ",
                    'lang' => 'painless'
                  ]
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
          'lending_stats' => [
            'filter' => $filterLending,
            'aggs' => [
              'working_time_buckets' => [
                'terms' => [
                  'script' => [
                    'source' => "
                                      def requestDate = doc.containsKey('request_date') && doc['request_date'].size() > 0 ? doc['request_date'].value.toInstant().toEpochMilli() : null;
                                      def fulfillDate = doc.containsKey('fulfill_date') && doc['fulfill_date'].size() > 0 ? doc['fulfill_date'].value.toInstant().toEpochMilli() : null;
  
                                      if (requestDate == null) return null;
                                      if (fulfillDate == null) return null;
  
                                      def duration = (fulfillDate - requestDate) / 1000 / 60 / 60 / 24; // Convert to days
  
                                      if (duration <= 1) return 'Within a day';
                                      else if (duration <= 7) return 'Within a week';
                                      else return 'Longer than a week';
                                  ",
                    'lang' => 'painless'
                  ]
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

    $response = $this->client->search($params);

    // Cleanup the output
    $borrowingData = isset($response['aggregations']['borrowing_stats']['working_time_buckets']['buckets'])
      ? $response['aggregations']['borrowing_stats']['working_time_buckets']['buckets']
      : [];

    $lendingData = isset($response['aggregations']['lending_stats']['working_time_buckets']['buckets'])
      ? $response['aggregations']['lending_stats']['working_time_buckets']['buckets']
      : [];

    return response()->json([
      'as_borrower' => $borrowingData,
      'as_lender' => $lendingData
    ]);
  }
}
