<?php

namespace App\Http\Controllers\Stats;

use App\Http\Controllers\Stats\BaseStatsController;
use Exception;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Log;

/**
 * This controller returns the number of requests made per year and the number of borrowing libraries that received at least one request in such year 
 */
class BorrowingLibrariesStats extends BaseStatsController
{
  public function __invoke()
  {
    $params = [
      'index' => 'docdel_requests',
      'body'  => [
        'size' => 0, // no documents in returns, only aggregations
        'aggs' => [
          'years' => [
            'date_histogram' => [
              'field'             => 'request_date',
              'calendar_interval' => 'year',
              'format'            => 'yyyy'
            ],
            'aggs' => [
              // Total number of requests per year THAT HAVE BEEN REQUESTED (not created)
              'total_requests' => [
                'value_count' => [
                  'field' => 'id'
                ]
              ],
              // Count of unique borrowing libraries per year
              'borrowing_libraries' => [
                'cardinality' => [
                  'field' => 'borrowing_library.id'
                ]
              ],
              // Count of unique lending libraries per year
              'lending_libraries' => [
                'cardinality' => [
                  'field' => 'lending_library.id'
                ]
              ],
            ]
          ]
        ]
      ]
    ];

    try {
      $response = $this->client->search($params);
    } catch (Exception $e) {
      Log::error("Error in borrowing libraries stats: " . $e->getMessage());
      throw new Exception("Statistics are momentarily unavailable, please try again later.");
    }

    $result = [];
    foreach ($response['aggregations']['years']['buckets'] as $bucket) {
      $result[$bucket['key_as_string']] = [
        "total_requests" => $bucket['total_requests']['value'],
        "borrowing_libraries" => $bucket['borrowing_libraries']['value'],
        "lending_libraries" => $bucket['lending_libraries']['value'],
      ];
    }

    return response()->json($result);
  }
}
