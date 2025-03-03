<?php

namespace App\Http\Controllers\Stats;

use App\Http\Controllers\Stats\BaseStatsController;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Log;

/**
 * This controller returns statistics about Open Access references. It distributes by borrowing_status and for each of them it returns 
 * the sub-distribution by pdf editorial requested.
 */
class OAReferencesStats extends BaseStatsController
{
  public function __invoke()
  {
    $params = [
      'index' => 'docdel_requests',
      'body'  => [
        'size' => 0, // No docs in output, only aggs
        'aggs' => [
          // Total number of unique references
          'unique_references' => [
            'cardinality' => [
              'field' => 'reference.id'
            ]
          ],
          // Filter for documents where reference.oa_link is not null
          'references_with_oa' => [
            'filter' => [
              'exists' => [
                'field' => 'reference.oa_link'
              ]
            ],
            'aggs' => [
              // Count unique references that have an oa_link
              'unique_references_with_oa' => [
                'cardinality' => [
                  'field' => 'reference.id'
                ]
              ],
              // Aggregate by aggregated_borrowing_status
              'by_status' => [
                'terms' => [
                  'field' => 'aggregated_borrowing_status.keyword'
                ],
                'aggs' => [
                  // Within each status bucket, aggregate by request_pdf_editorial
                  'by_pdf_editorial' => [
                    'terms' => [
                      'field' => 'request_pdf_editorial'
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

    return $response;
  }
}
