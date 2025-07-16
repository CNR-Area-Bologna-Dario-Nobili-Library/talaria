<?php

namespace App\Http\Controllers\Stats;

use App\Helper\StatsHelper;
use App\Http\Controllers\Stats\BaseStatsController;
use Exception;
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
    $create_query = StatsHelper::createQuery($request);
    $query = $create_query['query'];
    $agg_info = $create_query['agg_info'];

    $filterBorrowing = $agg_info['borrowing_field'] && $agg_info['query_id'] !== null
      ? ['term' => [$agg_info['borrowing_field'] => $agg_info['query_id']]]
      : ['match_all' => new \stdClass()];

    $filterLending = $agg_info['lending_field'] && $agg_info['query_id'] !== null
      ? ['term' => [$agg_info['lending_field'] => $agg_info['query_id']]]
      : ['match_all' => new \stdClass()];

    $params = [
      'index' => 'docdel_requests',
      'body' => [
        'size' => 0, // No data returned, only aggregations
        'query' => $query,
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
              ],
              'valid_request_count' => [
                'scripted_metric' => [
                  'init_script' => 'state.count = 0',
                  'map_script' => "
                                      def requestDate = doc.containsKey('request_date') && doc['request_date'].size() > 0 ? doc['request_date'].value.toInstant().toEpochMilli() : null;
                                      def fulfillDate = doc.containsKey('fulfill_date') && doc['fulfill_date'].size() > 0 ? doc['fulfill_date'].value.toInstant().toEpochMilli() : null;
                                      if (requestDate != null && fulfillDate != null) {
                                          state.count += 1;
                                      }
                                  ",
                  'combine_script' => 'return state.count',
                  'reduce_script' => 'return states.stream().mapToInt(s -> s).sum()'
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
              ],
              'valid_request_count' => [
                'scripted_metric' => [
                  'init_script' => 'state.count = 0',
                  'map_script' => "
                                      def requestDate = doc.containsKey('request_date') && doc['request_date'].size() > 0 ? doc['request_date'].value.toInstant().toEpochMilli() : null;
                                      def fulfillDate = doc.containsKey('fulfill_date') && doc['fulfill_date'].size() > 0 ? doc['fulfill_date'].value.toInstant().toEpochMilli() : null;
                                      if (requestDate != null && fulfillDate != null) {
                                          state.count += 1;
                                      }
                                  ",
                  'combine_script' => 'return state.count',
                  'reduce_script' => 'return states.stream().mapToInt(s -> s).sum()'
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
      Log::error("Error in working time stats: " . $e->getMessage());
      throw new Exception("Statistics are momentarily unavailable, please try again later.");
    }

    // Cleanup the output
    $borrowingData = isset($response['aggregations']['borrowing_stats']['working_time_buckets']['buckets'])
      ? $response['aggregations']['borrowing_stats']['working_time_buckets']['buckets']
      : [];

    $lendingData = isset($response['aggregations']['lending_stats']['working_time_buckets']['buckets'])
      ? $response['aggregations']['lending_stats']['working_time_buckets']['buckets']
      : [];

    $totalBorrowing = $response['aggregations']['borrowing_stats']['valid_request_count']['value'] ?? 0;
    $totalLending = $response['aggregations']['lending_stats']['valid_request_count']['value'] ?? 0;

    return response()->json([
      'total_borrowing' => $totalBorrowing,
      'total_lending' => $totalLending,
      'as_borrower' => $borrowingData,
      'as_lender' => $lendingData
    ]);
  }
}
