<?php

/* NOTE: this controller uses standard dispatch method so it can run without "filter" or policy 
and uses AdminApiController that disable authorization/permission/abilities*/

namespace App\Http\Controllers\Stats;

use App\Models\Institutions\Institution;
use App\Models\Institutions\InstitutionTransformer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\AdminApiController;

use Illuminate\Support\Facades\Log;

class AdminStatsController extends AdminApiController
{
    protected $elasticsearch;
    
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->broadcast = false;
        $this->client = app('Elasticsearch\Client');
        // Log::info("admin controller netered 2022");
    }

    //Elastic Search TEST API
    public function eltest(Request $request)
    {                     
        return ["a"=>3,"b"=>"test"];
    }

    public function eltest2()
    {
        $params = [
            'index' => 'my-testing-index',
            'body' => [
                'query' => [
                    'match_all' => new \stdClass()
                ]
            ]
        ];

        try {
            $response = $this->client->search($params);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
        return response()->json($response);
    }

    protected function getStatusMap($statusType) {
        $borrowingStatusMap = [
            1 => ["newrequest", "requested"],
            2 => ["deliveringtodesk", "deskreceived", "deliveredtouser", "fulfilled", "documentready", "documentreadyarchived"],
            3 => ["notdeliveredtouser", "notreceived", "notreceivedarchived"], // Conditional on 'forward'
            4 => ["cancelrequested", "canceledaccepted", "canceled"],
            5 => ["notreceived", "notreceivedarchived"],  // Conditional on 'forward'
            6 => ["documentnotready", "documentnotreadyarchived"], // Conditional on 'forward'
            7 => ["documentnotready", "documentnotreadyarchived"] // Conditional on 'forward'
        ];
    
        $lendingStatusMap = [
            1 => ["requestreceived", "willsupply"],
            2 => ["copycompleted"],
            3 => ["unfilled"],
            4 => ["cancelrequested", "cancelaccepted"],
            5 => null
        ];
    
        if ($statusType === 'borrowing') {
            return $borrowingStatusMap;
        } elseif ($statusType === 'lending') {
            return $lendingStatusMap;
        }
    
        return [];
    }

    public function getBorrowingStats(Request $request)
    {
        $validated = $request->validate([
            'year' => 'integer|min:2020|max:'.date('Y'),
            'borrowing_library_id' => 'integer|min:1',
            'material_type' => 'integer|min:1',
            'borrowing_status' => 'integer|min:1',
            'fulfill_type' => 'integer|min:1|nullable',
            'notfulfill_type' => 'integer|min:1|nullable'
        ]);

        $year = $validated['year'] ?? null;
        $borrowing_library_id = $validated['borrowing_library_id'] ?? null;
        $material_type = $validated['material_type'] ?? null;
        $borrowing_status = $validated['borrowing_status'] ?? null;
        $fulfill_type = $validated['fulfill_type'] ?? null;
        $notfulfill_type = $validated['notfulfill_type'] ?? null;

        // Aggregate by borrowing_status
        $statusMap = $this->getStatusMap('borrowing');

        // Elasticsearch main query
        $query = [
            'index' => 'docdel_test',
            'body'  => [
                'size' => 0, // Aggregations only, no search hits needed
                'query' => [
                    'bool' => [
                        'must' => [
                            
                        ],
                        // 'must_not' => [
                        //     'terms' => ['borrowing_status' => ['documentNotReady', 'documentNotReadyArchived']]
                        // ]
                    ]
                ],
                'aggs' => [
                    'by_material_type' => [
                        'terms' => ['field' => 'reference.material_type'],
                    ],
                    'by_borrowing_status' => [
                       'filters' => [
                            'filters' => [
                                'in_progress' => [
                                    'terms' => ['borrowing_status.keyword' => ['newrequest', 'requested']]
                                ],
                                'fulfilled' => [
                                    'terms' => ['borrowing_status.keyword' => ['deliveringtodesk', 'deskreceived', 'deliveredtouser', 'fulfilled', 'documentReady', 'documentreadyarchived']]
                                ],
                                'canceled' => [
                                    'terms' => ['borrowing_status.keyword' => ['cancelRequested', 'canceledAccepted', 'canceled']]
                                ],
                                'not_fulfilled' => [
                                    'script' => [
                                        'script' => "(doc['borrowing_status.keyword'].value == 'notDeliveredToUser' || doc['borrowing_status.keyword'].value == 'notReceived' || doc['borrowing_status.keyword'].value == 'notReceivedArchived') && doc['forward'].value == 0",
                                    ]
                                ],
                                'not_fulfilled_forwarded' => [
                                    'script' => [
                                        'script' => "(doc['borrowing_status.keyword'].value == 'notReceived' || doc['borrowing_status.keyword'].value == 'notReceivedArchived') && doc['forward'].value == 1",
                                    ]
                                ],
                                'fulfillled_not_received' => [
                                    'script' => [
                                        'script' => "(doc['borrowing_status.keyword'].value == 'documentNotReady' || doc['borrowing_status.keyword'].value == 'documentNotReadyArchived') && doc['forward'].value == 0",
                                    ]
                                ],
                                'fulfillled_not_received_forwarded' => [
                                    'script' => [
                                        'script' => "(doc['borrowing_status.keyword'].value == 'documentNotReady' || doc['borrowing_status.keyword'].value == 'documentNotReadyArchived') && doc['forward'].value == 1",
                                    ]
                                ]
                            ]
                        ]
                    ],
                    'by_fulfill_type' => [
                        'terms' => ['field' => 'fulfill_type'],
                    ],
                    'by_notfulfill_type' => [
                        'terms' => ['field' => 'notfulfill_type'],
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

        // If a library is provided, add it to the query
        if ($borrowing_library_id) {
            $query['body']['query']['bool']['must'][] = [
                'term' => [
                    'borrowing_library.id' => $borrowing_library_id
                ]
            ];
        }

        // If a material type is provided, add it to the query
        if ($material_type) {
            $query['body']['query']['bool']['must'][] = [
                'term' => [
                    'reference.material_type' => $material_type
                ]
            ];
        }

        if ($borrowing_status && array_key_exists($borrowing_status, $statusMap)) {
            $query['body']['query']['bool']['must'][] = [
                'terms' => [
                    'borrowing_status' => $statusMap[$borrowing_status]
                ]
            ];

            // Filter by fulfill_type if borrowing_status is 2 (fulfilled)
            if ($borrowing_status == 2 && $fulfill_type) {
                $query['body']['query']['bool']['must'][] = [
                    'term' => [
                        'fulfill_type' => $fulfill_type
                    ]
                ];
            }

            // Filter by reason_unfilled if borrowing_status is 3 (notfulfilled)
            if ($borrowing_status == 3 && $notfulfill_type) {
                $query['body']['query']['bool']['must'][] = [
                    'term' => [
                        'notfulfill_type' => $notfulfill_type
                    ]
                ];
            }

            // Handle forward
            if (in_array($borrowing_status, [3, 5, 6, 7])) {
                Log::info("borrowing_status: {$borrowing_status}");
                $query['body']['query']['bool']['must'][] = [
                    'term' => [
                        'forward' => ($borrowing_status == 5 || $borrowing_status == 7) ? 1 : 0
                    ]
                ];
            }
        }

        try {
            $response = $this->client->search($query);
            // Log::info('Elasticsearch Query', $query);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }

        return response()->json($response);
        // return $response["hits"]["total"]["value"];
    }

    public function getAvgWorkingTime(Request $request)
    {
        $validated = $request->validate([
            'year' => 'integer|min:2020|max:'.date('Y'),
            'library_id' => 'integer|min:1'
        ]);

        $year = $validated['year'] ?? null;
        $library_id = $validated['library_id'] ?? null;

        $params = [
            'index' => 'docdel_test',
            'body'  => [
                'size' => 0,
                'query' => [
                    'bool' => [
                        'must' => [
                            // [
                            //     'range' => [
                            //         'request_date' => [
                            //             'gte' => "{$year}-01-01",
                            //             'lte' => "{$year}-12-31",
                            //             'format' => 'yyyy-MM-dd'
                            //         ]
                            //     ]
                            // ],
                            [
                                'exists' => [
                                    'field' => 'fulfill_date'
                                ]
                            ],
                            [
                                'exists' => [
                                    'field' => 'request_date'
                                ]
                            ]
                        ]
                    ]
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
                            'avg_working_time' => [
                                'avg' => [
                                    'script' => [
                                        'source' => "if (doc['fulfill_date'].size() == 0 || doc['request_date'].size() == 0) { return null; } else { return (doc['fulfill_date'].value.millis - doc['request_date'].value.millis); }",
                                        'lang' => 'painless'
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ]
        ];

        if ($year) {
            $params['body']['query']['bool']['must'][] = [
                'range' => [
                    'request_date' => [
                        'gte' => "{$year}-01-01",
                        'lte' => "{$year}-12-31",
                        'format' => 'yyyy-MM-dd'
                    ]
                ]
            ];
        }

        if ($library_id) {
            $params['body']['query']['bool']['must'][] = [
                'term' => [
                    'lending_library.id' => $library_id
                ]
            ];
        }

        try {
            $results = $this->client->search($params);

            
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }

        // return response()->json($results['aggregations']['requests_per_month']['buckets']);
        return response()->json($results);
    }

    /**
     * This function represent stats number 4c (which countries borrow the most?) and 4d (which countries lend the most?)
     * Note that:
     * mode = 0 => borrower leaderboard
     * mode = 1 => lender leaderboard
     */
    public function getRequestsCountriesLeaderboard(Request $request) 
    {
        $validated = $request->validate([
            'mode' => 'integer|min:0|max:1|required',
            'year' => 'integer|min:2020|max:'.date('Y'),
        ]);

        $mode = $validated['mode'] == 0 ? ['borrowing', 'lending'] : ['lending', 'borrowing'];
        $year = $validated['year'] ?? null;

        $statusMap = $this->getStatusMap($mode[0]);

        $params = [
            'index' => 'docdel_test',
            'size' => 0,
            'body'  => [
                'query' => [
                    'bool' => [
                        'must' => [
                            [
                                'terms' => [ $mode[0] . '_status' => $statusMap[2] ]
                            ]
                        ]
                    ]
                ],
                'aggs' => [
                    'countries' => [
                        'terms' => [
                            'field' => $mode[0] . '_library.country.name.keyword',
                            'size' => 100
                        ]
                    ]
                ]
            ]
        ];

        if ($year) {
            $params['body']['query']['bool']['must'][] = [
                'range' => [
                    'request_date' => [
                        'gte' => "{$year}-01-01",
                        'lte' => "{$year}-12-31",
                        'format' => 'yyyy-MM-dd'
                    ]
                ]
            ];
        }

        try {
            Log::info("params: " . print_r($params, true));
            $results = $this->client->search($params);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }

        return response()->json($results);
    }

    public function getRequestsCountriesFromLibrary(Request $request) {

        $validated = $request->validate([
            'library_id' => 'integer|min:1|required',
            'mode' => 'integer|min:0|max:1|required', // 0 = i am borrower (request 4a), 1 = i am lender (request 4b)
            'year' => 'integer|min:2020|max:'.date('Y'),
        ]);

        $library_id = $validated['library_id'];
        $mode = $validated['mode'] == 0 ? ['borrowing', 'lending'] : ['lending', 'borrowing'];
        $year = $validated['year'] ?? null;

        $statusMap = $this->getStatusMap($mode[0]);

        // Log::info("mode: {$mode[0]}, statusMap: " . print_r($statusMap, true));

        $params = [
            'index' => 'docdel_test',
            'size' => 0,
            'body'  => [
                'query' => [
                    'bool' => [
                        'must' => [
                            [
                                'term' => [ $mode[0] . '_library.id' => $library_id ]
                            ],
                            [
                                'terms' => [ $mode[0] . '_status' => $statusMap[2] ]
                            ]
                        ]
                    ]
                ],
                'aggs' => [
                    'countries' => [
                        'terms' => [
                            'field' => $mode[1] . '_library.country.name.keyword',
                            'size' => 100
                        ]
                    ]
                ]
            ]
        ];

        if ($year) {
            $params['body']['query']['bool']['must'][] = [
                'range' => [
                    'request_date' => [
                        'gte' => "{$year}-01-01",
                        'lte' => "{$year}-12-31",
                        'format' => 'yyyy-MM-dd'
                    ]
                ]
            ];
        }

        try {
            // Log::info("params = ", $params);
            $results = $this->client->search($params);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }

        return response()->json($results);
    }

    public function getRequestsCountriesFromCountry(Request $request) {

        $validated = $request->validate([
            'country_id' => 'integer|min:1|required',
            'mode' => 'integer|min:0|max:1|required', // 0 = i am borrower, 1 = i am lender
            'year' => 'integer|min:2020|max:'.date('Y'),
        ]);

        $country_id = $validated['country_id'];
        $mode = $validated['mode'] == 0 ? ['borrowing', 'lending'] : ['lending', 'borrowing'];
        $year = $validated['year'] ?? null;

        $statusMap = $this->getStatusMap($mode[0]);

        $params = [
            'index' => 'docdel_test',
            'size' => 0,
            'body' => [
                'query' => [
                    'bool' => [
                        'must' => [
                            [
                                'term' => [ $mode[0] . '_library.country.id' => $country_id ]
                            ],
                            [
                                'terms' => [ $mode[0] . '_status' => $statusMap[2] ]
                            ]
                        ]
                    ]
                ],
                'aggs' => [
                    'countries' => [
                        'terms' => [
                            'field' => $mode[1] . '_library.country.name.keyword',
                            'size' => 100
                        ]
                    ]
                ]
            ]
        ];

        if ($year) {
            $params['body']['query']['bool']['must'][] = [
                'range' => [
                    'request_date' => [
                        'gte' => "{$year}-01-01",
                        'lte' => "{$year}-12-31",
                        'format' => 'yyyy-MM-dd'
                    ]
                ]
            ];
        }

        try {
            Log::info("params = ", $params);
            $results = $this->client->search($params);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }

        return response()->json($results);
    }
}    
