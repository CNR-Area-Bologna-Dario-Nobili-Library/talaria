<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

use Carbon\Carbon;
use App\Models\Requests\DocdelRequest;

class InitializeElasticsearchIndex implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        // Create index
        $this->createIndex();

        // Populate index
        $this->populateIndex();
    }

    /**
     * Check if the index exists and if not, creates it.
     */
    private function createIndex()
    {
        /** @var Elasticsearch\Client $client */
        $client = app('Elasticsearch\Client');

        // Define the index structure with mappings
        $params = [
            'index' => 'docdel_requests', // The name of the index
            'body' => [
                'mappings' => [
                    'properties' => [
                        'borrowing_library' => [
                            'properties' => [
                                'country' => [
                                    'properties' => [
                                        'code' => [
                                            'type' => 'text',
                                            'fields' => [
                                                'keyword' => [
                                                    'type' => 'keyword',
                                                    'ignore_above' => 256
                                                ]
                                            ]
                                        ],
                                        'created_at' => [
                                            'type' => 'text',
                                            'fields' => [
                                                'keyword' => [
                                                    'type' => 'keyword',
                                                    'ignore_above' => 256
                                                ]
                                            ]
                                        ],
                                        'id' => [
                                            'type' => 'long'
                                        ],
                                        'name' => [
                                            'type' => 'text',
                                            'fields' => [
                                                'keyword' => [
                                                    'type' => 'keyword',
                                                    'ignore_above' => 256
                                                ]
                                            ]
                                        ],
                                        'updated_at' => [
                                            'type' => 'text',
                                            'fields' => [
                                                'keyword' => [
                                                    'type' => 'keyword',
                                                    'ignore_above' => 256
                                                ]
                                            ]
                                        ]
                                    ]
                                ],
                                'id' => [
                                    'type' => 'long'
                                ],
                                'institution' => [
                                    'properties' => [
                                        'country' => [
                                            'properties' => [
                                                'code' => [
                                                    'type' => 'text',
                                                    'fields' => [
                                                        'keyword' => [
                                                            'type' => 'keyword',
                                                            'ignore_above' => 256
                                                        ]
                                                    ]
                                                ],
                                                'created_at' => [
                                                    'type' => 'text',
                                                    'fields' => [
                                                        'keyword' => [
                                                            'type' => 'keyword',
                                                            'ignore_above' => 256
                                                        ]
                                                    ]
                                                ],
                                                'id' => [
                                                    'type' => 'long'
                                                ],
                                                'name' => [
                                                    'type' => 'text',
                                                    'fields' => [
                                                        'keyword' => [
                                                            'type' => 'keyword',
                                                            'ignore_above' => 256
                                                        ]
                                                    ]
                                                ],
                                                'updated_at' => [
                                                    'type' => 'text',
                                                    'fields' => [
                                                        'keyword' => [
                                                            'type' => 'keyword',
                                                            'ignore_above' => 256
                                                        ]
                                                    ]
                                                ]
                                            ]
                                        ],
                                        'id' => [
                                            'type' => 'long'
                                        ],
                                        'institution_type' => [
                                            'properties' => [
                                                'id' => [
                                                    'type' => 'long'
                                                ],
                                                'name' => [
                                                    'type' => 'text',
                                                    'fields' => [
                                                        'keyword' => [
                                                            'type' => 'keyword',
                                                            'ignore_above' => 256
                                                        ]
                                                    ]
                                                ]
                                            ]
                                        ],
                                        'name' => [
                                            'type' => 'text',
                                            'fields' => [
                                                'keyword' => [
                                                    'type' => 'keyword',
                                                    'ignore_above' => 256
                                                ]
                                            ]
                                        ]
                                    ]
                                ],
                                'name' => [
                                    'type' => 'text',
                                    'fields' => [
                                        'keyword' => [
                                            'type' => 'keyword',
                                            'ignore_above' => 256
                                        ]
                                    ]
                                ],
                                'subject' => [
                                    'properties' => [
                                        'id' => [
                                            'type' => 'long'
                                        ],
                                        'name' => [
                                            'type' => 'text',
                                            'fields' => [
                                                'keyword' => [
                                                    'type' => 'keyword',
                                                    'ignore_above' => 256
                                                ]
                                            ]
                                        ]
                                    ]
                                ],
                            ]
                        ],
                        'borrowing_status' => [
                            'type' => 'text',
                            'fields' => [
                                'keyword' => [
                                    'type' => 'keyword',
                                    'ignore_above' => 256
                                ]
                            ]
                        ],
                        'forward' => [
                            'type' => 'long'
                        ],
                        'fulfill_date' => [
                            'type' => 'date',
                            'format' => 'yyyy-MM-dd HH:mm:ss'
                        ],
                        'fulfill_type' => [
                            'type' => 'long'
                        ],
                        'id' => [
                            'type' => 'long'
                        ],
                        'lending_library' => [
                            'properties' => [
                                'country' => [
                                    'properties' => [
                                        'code' => [
                                            'type' => 'text',
                                            'fields' => [
                                                'keyword' => [
                                                    'type' => 'keyword',
                                                    'ignore_above' => 256
                                                ]
                                            ]
                                        ],
                                        'id' => [
                                            'type' => 'long'
                                        ],
                                        'name' => [
                                            'type' => 'text',
                                            'fields' => [
                                                'keyword' => [
                                                    'type' => 'keyword',
                                                    'ignore_above' => 256
                                                ]
                                            ]
                                        ]
                                    ]
                                ],
                                'id' => [
                                    'type' => 'long'
                                ],
                                'institution' => [
                                    'properties' => [
                                        'id' => [
                                            'type' => 'long'
                                        ],
                                        'name' => [
                                            'type' => 'text',
                                            'fields' => [
                                                'keyword' => [
                                                    'type' => 'keyword',
                                                    'ignore_above' => 256
                                                ]
                                            ]
                                        ]
                                    ]
                                ]
                            ]
                        ],
                        'request_date' => [
                            'type' => 'date',
                            'format' => 'yyyy-MM-dd HH:mm:ss'
                        ],
                    ]
                ]
            ]
        ];

        // Check if the index already exists
        if (!$client->indices()->exists(['index' => 'docdel_requests'])) {
            // Create the index
            $response = $client->indices()->create($params);

            if ($response['acknowledged']) {
                echo "Index 'docdel_requests' created successfully.\n";
            } else {
                echo "Failed to create the index.\n";
            }
        } else {
            echo "Index 'docdel_requests' already exists.\n";
        }
    }


    /**
     * Parse the requests from the DB and populate the index in bulk.
     */
    private function populateIndex()
    {
        // Get all requests with eager loading
        $requests = DocdelRequest::with([
            'reference',
            'borrowinglibrary',
            'lendinglibrary'
        ])->get();

        // Bulk params
        $bulkParams = ['body' => []];
        $batchSize = 100;

        foreach($requests as $request) {
            $bulkParams['body'][] = [
                'index' => [
                    '_index' => 'docdel_requests',
                    '_id' => $request->id
                ]
            ];

            $bulkParams['body'][] = [
                'id' => $request->id,
                'request_date' => $request->request_date ? Carbon::parse($request->request_date)->format('Y-m-d H:i:s') : null,
                'fulfill_date' => $request->fulfill_date ? Carbon::parse($request->fulfill_date)->format('Y-m-d H:i:s') : null,
                'borrowing_status' => $request->borrowing_status,
                'lending_status' => $request->lending_status,
                'fulfill_type' => $request->fulfill_type,
                'notfulfill_type' => $request->notfulfill_type,
                'forward' => $request->forward,
                'borrowing_library' => $this->createLibraryObject($request->borrowinglibrary),
                'lending_library' => $request->lendinglibrary ? $this->createLibraryObject($request->lendinglibrary) : null,
                'reference' => $request->reference->only([
                    'id', 'material_type', 'pub_type', 'pubyear', 'issn', 'isbn', 'oa_link', 'pub_title'
                ]),
            ];

            /**
             * Each document requires 2 entries in the bulk request: 
             * Action Entry ({ "index": { "_index": "docdel_requests", "_id": "1" } }) and 
             * Document Body ({ "id": "1", "title": "Document title", "content": "Document content" })
             */
            if(count($bulkParams['body']) >= $batchSize * 2) {
                $this->sendBulkRequest($bulkParams);
                // Reset
                $bulkParams = ['body' => []];
            }
        }
        
        // Send any remaining docs
        if (!empty($bulkParams['body'])) {
            $this->sendBulkRequest($bulkParams);
        }

        echo "Elasticsearch index populated\n";
    }

    /**
     * Auxiliary function to create the library object
     */
    private function createLibraryObject($library)
    {
        return [
            'id' => $library->id,
            'name' => $library->name,
            'country' => $library->country->only([
                'id', 'name', 'code'
            ]),
            'subject' => $library->subject->only([
                'id', 'name'
            ]),
            'institution' => [
                'id' => $library->institution->id,
                'name' => $library->institution->name,
                'institution_type' => $library->institution->institution_type->only([
                    'id', 'name'
                ]),
                'country' => $library->institution->country->only([
                    'id', 'name', 'code'
                ])
            ]
        ];
    }

    /**
     * Auxiliary function to send the bulk request
     */
    private function sendBulkRequest($bulkParams)
    {
        /** @var Elasticsearch\Client $client */
        $client = app('Elasticsearch\Client');
        
        $response = $client->bulk($bulkParams);

        if($response['errors']) {
            echo "Elasticsearch index failed to populate";
            var_dump($response);
        } else {
            echo "Bulk indexing succesful.\n";
        }
    }
}
