<?php

namespace App\Http\Controllers\Stats;

use App\Helper\StatsHelper;
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
    $create_query = StatsHelper::createQuery($request);
    $query = $create_query['query'];
    $agg_info = $create_query['agg_info'];

    $filterBorrower = [
      'bool' => [
        'must' => array_values(array_filter([
          ['term' => ['aggregated_borrowing_status.keyword' => 'Received']],
          $agg_info['borrowing_field'] && $agg_info['query_id'] !== null
            ? ['term' => [$agg_info['borrowing_field'] => $agg_info['query_id']]]
            : null
        ]))
      ]
    ];

    $filterLender = [
      'bool' => [
        'must' => array_values(array_filter([
          ['term' => ['aggregated_lending_status.keyword' => 'Fulfilled']],
          $agg_info['lending_field'] && $agg_info['query_id'] !== null
            ? ['term' => [$agg_info['lending_field'] => $agg_info['query_id']]]
            : null
        ]))
      ]
    ];

    $params = [
      'index' => 'docdel_requests',
      'body' => [
        'size' => 0,
        'query' => $query,
        'aggs' => [
          'as_borrower' => [
            'filter' => $filterBorrower,
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
            'filter' => $filterLender,
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
