<?php

namespace App\Http\Controllers\Stats;

use App\Http\Controllers\Stats\BaseStatsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

/**
 * This controller handles the distribution of fulfilled requests to or from countries.
 * 
 * It acts differently based on what parameters are given:
 * If none it returns the leaderboard of most borrowing and lending countries
 * If library_id is given it returns the leaderboard of most borrowing and lending countries from or to given library.
 * If country_id is given it returns the leaderboard of most borrowing and lending countries from or to given country.
 */
class CountriesStats extends BaseStatsController
{
  public function __invoke(Request $request)
  {
    // Validate optional parameters 'year', 'library_id' and 'country_id'
    $validated = $request->validate([
      'year' => 'sometimes|integer|min:2020|max:' . date('Y'),
      'library_id' => 'sometimes|integer|exists:libraries,id', // Using talaria normally
      'country_id' => 'sometimes|integer|exists:countries,id',  // Using talaria normally
      'institution_id' => 'sometimes|integer|exists:institutions,id',
      // 'library_id' => 'sometimes|integer',  // Using RSCVD prod for stats
      // 'country_id' => 'sometimes|integer'   // Using RSCVD prod for stats
    ]);

    $year = $validated['year'] ?? null;
    $library_id = $validated['library_id'] ?? null;
    $country_id = $validated['country_id'] ?? null;
    $institution_id = $validated['institution_id'] ?? null;

    $borrowing_query_condition = null;
    $lending_query_condition = null;
    $query_id = null;

    // Priority: Library >> Country >> Institution
    if ($library_id) {
      $borrowing_query_condition = "borrowing_library.id";
      $lending_query_condition = "lending_library.id";
      $query_id = $library_id;
    } else if ($country_id) {
      $borrowing_query_condition = "borrowing_library.country.id";
      $lending_query_condition = "lending_library.country.id";
      $query_id = $country_id;
    } else if ($institution_id) {
      $borrowing_query_condition = "borrowing_library.institution.id";
      $lending_query_condition = "lending_library.institution.id";
      $query_id = $institution_id;
    }

    $query = [
      'index' => 'docdel_requests',
      'body'  => [
        'size'  => 0,
        'aggs' => []
      ]
    ];

    // I AM BORROWER AND I SEARCH WHO FULFILLS MY REQUESTS 
    $query['body']['aggs']['providing'] = [
      'filter' => [
        'bool' => [
          'must' => array_filter(
            [
              ['term' => ['aggregated_borrowing_status.keyword' => 'Received']],
              $query_id ? ['term' => [$borrowing_query_condition => $query_id]] : null // <-- This line is conditional because if nothing is provided it makes a leaderboard of countries
            ]
          )
        ]
      ],
      'aggs' => [
        'countries_requested_from' => [
          'terms' => [
            'field' => 'lending_library.country.name.keyword',
            'size' => 100
          ],
          'aggs' => [
            'country_details' => [
              'top_hits' => [
                'size' => 1,
                '_source' => [
                  'includes' => [
                    'lending_library.country.id',
                    'lending_library.country.code',
                    'lending_library.country.name'
                  ]
                ]
              ]
            ]
          ]
        ]
      ]
    ];

    // I AM LENDER AND I SEARCH WHO ASKS ME DOCUMENTS
    $query['body']['aggs']['requesting'] = [
      'filter' => [
        'bool' => [
          'must' => array_filter(
            [
              ['term' => ['aggregated_lending_status.keyword' => 'Fulfilled']],
              $query_id ? ['term' => [$lending_query_condition => $query_id]] : null // <-- This line is conditional because if nothing is provided it makes a leaderboard of countries
            ]
          )
        ]
      ],
      'aggs' => [
        'countries_requested_from' => [
          'terms' => [
            'field' => 'borrowing_library.country.name.keyword',
            'size' => 100
          ],
          'aggs' => [
            'country_details' => [
              'top_hits' => [
                'size' => 1,
                '_source' => [
                  'includes' => [
                    'borrowing_library.country.id',
                    'borrowing_library.country.code',
                    'borrowing_library.country.name'
                  ]
                ]
              ]
            ]
          ]
        ]
      ]
    ];

    // If a year is provided, add it to the query
    if ($year) {
      $query['body']['query']['bool']['must'][] = [
        'range' => [
          'request_date' => [
            'gte' => "{$year}-01-01",
            'lte' => "{$year}-12-31",
            'format' => 'yyyy-MM-dd'
          ]
        ]
      ];
    }

    $response = $this->client->search($query);
    $result = [
      "total_requests" => $response["hits"]["total"]["value"],
      "requesting" => [
        "total" => $response["aggregations"]["requesting"]["doc_count"],
        "countries" => []
      ],
      "providing" => [
        "total" => $response["aggregations"]["providing"]["doc_count"],
        "countries" => []
      ]
    ];

    // Extract requesting countries
    foreach ($response["aggregations"]["providing"]["countries_requested_from"]["buckets"] as $bucket) {
      $country_data = $bucket["country_details"]["hits"]["hits"][0]["_source"]["lending_library"]["country"];
      $result["providing"]["countries"][] = [
        // "id" => $country_data["id"],
        "name" => $country_data["name"],
        "code" => $country_data["code"],
        "count" => $bucket["doc_count"]
      ];
    }

    // Extract providing countries
    foreach ($response["aggregations"]["requesting"]["countries_requested_from"]["buckets"] as $bucket) {
      $country_data = $bucket["country_details"]["hits"]["hits"][0]["_source"]["borrowing_library"]["country"];
      $result["requesting"]["countries"][] = [
        // "id" => $country_data["id"],
        "name" => $country_data["name"],
        "code" => $country_data["code"],
        "count" => $bucket["doc_count"]
      ];
    }

    return response()->json($result);
  }
}
