<?php

namespace App\Http\Controllers\Stats;

use App\Http\Controllers\Stats\BaseStatsController;
use Exception;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Log;

/**
 * This controller returns the distribution of references publication year for fulfilled DD requests (both borrowing and lending)
 * It is possible to filter by year, library_id, institution_id, country_id and material type.
 */
class ReferencePubYearStats extends BaseStatsController
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
      // 'country_id' => 'sometimes|integer',
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

    $params = [
      'index' => 'docdel_requests',
      'body' => [
        'size' => 0,
        'query' => [
          'bool' => ['must' => $mustClauses]
        ],
        'aggs' => [
          'as_borrower' => [
            'filter' => [
              'bool' => [
                'must' => array_filter([
                  ['term' => ['aggregated_borrowing_status.keyword' => 'Received']],
                  $query_id ? ['term' => [$borrowing_query_condition => $query_id]] : null
                ])
              ]
            ],
            'aggs' => [
              'requests_by_pubyear' => [
                'terms' => [
                  'field' => 'reference.pubyear',
                  // 'size' => 1000,
                  // 'order' => ['_key' => 'asc']
                ]
              ]
            ]
          ],
          'as_lender' => [
            'filter' => [
              'bool' => [
                'must' => array_filter([
                  ['term' => ['aggregated_lending_status.keyword' => 'Fulfilled']],
                  $query_id ? ['term' => [$lending_query_condition => $query_id]] : null
                ])
              ]
            ],
            'aggs' => [
              'requests_by_pubyear' => [
                'terms' => [
                  'field' => 'reference.pubyear',
                  // 'size' => 1000,
                  // 'order' => ['_key' => 'asc']
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
      Log::error("Error in reference pubyear stats: " . $e->getMessage());
      throw new Exception("Statistics are momentarily unavailable, please try again later.");
    }

    return response()->json([
      'as_borrower' => $response['aggregations']['as_borrower']['requests_by_pubyear']['buckets'] ?? [],
      'as_lender' => $response['aggregations']['as_lender']['requests_by_pubyear']['buckets'] ?? []
    ]);
  }
}
