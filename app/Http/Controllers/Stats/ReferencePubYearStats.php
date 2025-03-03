<?php

namespace App\Http\Controllers\Stats;

use App\Http\Controllers\Stats\BaseStatsController;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Log;

/**
 * This controller returns the distribution of references publication year for fulfilled DD requests (both borrowing and lending)
 * It is possible to filter by year, library_id and material type.
 */
class ReferencePubYearStats extends BaseStatsController
{
  public function __invoke(Request $request)
  {
    $validated = $request->validate([
      'year' => 'sometimes|integer|min:2020|max:' . date('Y'),
      'library_id' => 'sometimes|integer|exists:libraries,id',
      'material_type' => 'sometimes|integer|min:1|max:5'
    ]);

    $year = $validated['year'] ?? null;
    $library_id = $validated['library_id'] ?? null;
    $material_type = $validated['material_type'] ?? null;

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
                  $library_id ? ['term' => ['borrowing_library.id' => $library_id]] : null
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
                  $library_id ? ['term' => ['lending_library.id' => $library_id]] : null
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

    $response = $this->client->search($params);

    return response()->json([
      'as_borrower' => $response['aggregations']['as_borrower']['requests_by_pubyear']['buckets'] ?? [],
      'as_lender' => $response['aggregations']['as_lender']['requests_by_pubyear']['buckets'] ?? []
    ]);
  }
}
