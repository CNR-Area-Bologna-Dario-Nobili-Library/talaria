<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

use Carbon\Carbon;
use App\Models\Requests\DocdelRequest;

use Illuminate\Support\Facades\Log;

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
        // Log::info("Im here!");
        ini_set('memory_limit', '512M');
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
        // Log::info("Starting creating index");
        /** @var Elasticsearch\Client $client */
        $client = app('Elasticsearch\Client');

        // Define the index structure with mappings
        $params = [
            'index' => 'docdel_requests', // The name of the index
            'body' => [
                'settings' => [
                    'number_of_shards' => 1,
                    'number_of_replicas' => 0
                ],
                'mappings' => [
                    'properties' => [
                        'id' => [
                            'type' => 'long'
                        ],
                        'request_date' => [
                            'type' => 'date',
                            'format' => 'yyyy-MM-dd HH:mm:ss'
                        ],
                        'fulfill_date' => [
                            'type' => 'date',
                            'format' => 'yyyy-MM-dd HH:mm:ss'
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
                        'lending_status' => [
                            'type' => 'text',
                            'fields' => [
                                'keyword' => [
                                    'type' => 'keyword',
                                    'ignore_above' => 256
                                ]
                            ]
                        ],
                        'fulfill_type' => [
                            'type' => 'long'
                        ],
                        'notfulfill_type' => [
                            'type' => 'long'
                        ],
                        'forward' => [
                            'type' => 'long'
                        ],
                        'trash_type' => [
                            'type' => 'long'
                        ],
                        'archived' => [
                            'type' => 'long'
                        ],
                        'request_pdf_editorial' => [
                            'type' => 'long'
                        ],
                        'request_special_delivery' => [
                            'type' => 'long'
                        ],
                        'borrowing_library' => [
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
                                ],
                                'country' => [
                                    'properties' => [
                                        'id' => [
                                            'type' => 'long'
                                        ],
                                        'code' => [
                                            'type' => 'text',
                                            'fields' => [
                                                'keyword' => [
                                                    'type' => 'keyword',
                                                    'ignore_above' => 256
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
                                        ],
                                        'country' => [
                                            'properties' => [
                                                'id' => [
                                                    'type' => 'long'
                                                ],
                                                'code' => [
                                                    'type' => 'text',
                                                    'fields' => [
                                                        'keyword' => [
                                                            'type' => 'keyword',
                                                            'ignore_above' => 256
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
                        'lending_library' => [
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
                                ],
                                'country' => [
                                    'properties' => [
                                        'id' => [
                                            'type' => 'long'
                                        ],
                                        'code' => [
                                            'type' => 'text',
                                            'fields' => [
                                                'keyword' => [
                                                    'type' => 'keyword',
                                                    'ignore_above' => 256
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
                                        ],
                                        'country' => [
                                            'properties' => [
                                                'id' => [
                                                    'type' => 'long'
                                                ],
                                                'code' => [
                                                    'type' => 'text',
                                                    'fields' => [
                                                        'keyword' => [
                                                            'type' => 'keyword',
                                                            'ignore_above' => 256
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
                        'reference' => [
                            'properties' => [
                                'id' => [
                                    'type' => 'long'
                                ],
                                'issn' => [
                                    'type' => 'text',
                                    'fields' => [
                                        'keyword' => [
                                            'type' => 'keyword',
                                            'ignore_above' => 256
                                        ]
                                    ]
                                ],
                                'isbn' => [
                                    'type' => 'text',
                                    'fields' => [
                                        'keyword' => [
                                            'type' => 'keyword',
                                            'ignore_above' => 256
                                        ]
                                    ]
                                ],
                                'doi' => [
                                    'type' => 'text',
                                    'fields' => [
                                        'keyword' => [
                                            'type' => 'keyword',
                                            'ignore_above' => 256
                                        ]
                                    ]
                                ],
                                'pmid' => [
                                    'type' => 'text',
                                    'fields' => [
                                        'keyword' => [
                                            'type' => 'keyword',
                                            'ignore_above' => 256
                                        ]
                                    ]
                                ],
                                'issn_l' => [
                                    'type' => 'text',
                                    'fields' => [
                                        'keyword' => [
                                            'type' => 'keyword',
                                            'ignore_above' => 256
                                        ]
                                    ]
                                ],
                                'sid' => [
                                    'type' => 'text',
                                    'fields' => [
                                        'keyword' => [
                                            'type' => 'keyword',
                                            'ignore_above' => 256
                                        ]
                                    ]
                                ],
                                'sbn_docid' => [
                                    'type' => 'text',
                                    'fields' => [
                                        'keyword' => [
                                            'type' => 'keyword',
                                            'ignore_above' => 256
                                        ]
                                    ]
                                ],
                                'acnp_cod' => [
                                    'type' => 'text',
                                    'fields' => [
                                        'keyword' => [
                                            'type' => 'keyword',
                                            'ignore_above' => 256
                                        ]
                                    ]
                                ],
                                'oa_link' => [
                                    'type' => 'text'
                                ],
                                'pub_title' => [
                                    'type' => 'text',
                                    'fields' => [
                                        'keyword' => [
                                            'type' => 'keyword',
                                            'ignore_above' => 256
                                        ]
                                    ]
                                ],
                                'pubyear' => [
                                    'type' => 'long'
                                ],
                                'material_type' => [
                                    'type' => 'long',
                                ]
                            ]
                        ]
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
        Log::info("Finished creating index");
    }


    /**
     * Parse the requests from the DB and populate the index in bulk.
     */
    // private function populateIndex()
    // {
    //     Log::info("Starting populating index");

    //     $batchSize = 1000;

    //     DocdelRequest::with(['reference', 'borrowinglibrary', 'lendinglibrary'])->chunk($batchSize, function ($requests) use ($batchSize) {
    //         // Bulk params
    //         $bulkParams = ['body' => []];

    //         foreach($requests as $request) {
    //             $bulkParams['body'][] = [
    //                 'index' => [
    //                     '_index' => 'docdel_requests',
    //                     '_id' => $request->id
    //                 ]
    //             ];

    //             $bulkParams['body'][] = [
    //                 'id' => $request->id,
    //                 'request_date' => $request->request_date ? Carbon::parse($request->request_date)->format('Y-m-d H:i:s') : null,
    //                 'fulfill_date' => $request->fulfill_date ? Carbon::parse($request->fulfill_date)->format('Y-m-d H:i:s') : null,
    //                 'borrowing_status' => $request->borrowing_status,
    //                 'lending_status' => $request->lending_status,
    //                 'fulfill_type' => $request->fulfill_type,
    //                 'notfulfill_type' => $request->notfulfill_type,
    //                 'forward' => $request->forward,
    //                 'borrowing_library' => $this->createLibraryObject($request->borrowinglibrary),
    //                 'lending_library' => $request->lendinglibrary ? $this->createLibraryObject($request->lendinglibrary) : null,
    //                 'reference' => $request->reference->only([
    //                     'id', 'material_type', 'pubyear', 'issn', 'isbn', 'oa_link', 'pub_title'
    //                 ]),
    //             ];

    //             /**
    //              * Each document requires 2 entries in the bulk request: 
    //              * Action Entry ({ "index": { "_index": "docdel_requests", "_id": "1" } }) and 
    //              * Document Body ({ "id": "1", "title": "Document title", "content": "Document content" })
    //              */
    //             if(count($bulkParams['body']) >= $batchSize * 2) {
    //                 $this->sendBulkRequest($bulkParams);
    //                 // Reset
    //                 $bulkParams = ['body' => []];
    //             }

    //             // Error checks
    //             if (isset($response['errors']) && $response['errors']) {
    //                 foreach ($response['items'] as $item) {
    //                     if (isset($item['index']['error'])) {
    //                         Log::error('Failed to index document ' . $item['index']['_id'] . ': ' . json_encode($item['index']['error']));
    //                     }
    //                 }
    //             }

    //             unset($bulkParams);
    //         }

    //         // Send any remaining docs
    //         if (!empty($bulkParams['body'])) {
    //             $this->sendBulkRequest($bulkParams);
    //         }
    //     });

    //     Log::info("Finished populating index");

    //     // // Get all requests with eager loading
    //     // $requests = DocdelRequest::with([
    //     //     'reference',
    //     //     'borrowinglibrary',
    //     //     'lendinglibrary'
    //     // ])->get();
    // }
    private function populateIndex()
    {
        Log::info("Starting populating index");

        $batchSize = 2500;
        DocdelRequest::with(['reference', 'borrowinglibrary', 'lendinglibrary'])->chunk($batchSize, function ($requests) use ($batchSize) {
            // Bulk params
            $bulkParams = ['body' => []];

            foreach ($requests as $request) {
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
                    'trash_type' => $request->trash_type,
                    'archived' => $request->archived,
                    'request_pdf_editorial' => $request->request_pdf_editorial,
                    'request_special_delivery' => $request->request_special_delivery,
                    'borrowing_library' => $this->createLibraryObject($request->borrowinglibrary),
                    'lending_library' => $request->lendinglibrary ? $this->createLibraryObject($request->lendinglibrary) : null,
                    'reference' => $request->reference->only([
                        'id',
                        'material_type',
                        'pubyear',
                        'issn',
                        'isbn',
                        'doi',
                        'issn_l',
                        'pmid',
                        'sid',
                        'sbn_docid',
                        'acnp_cod',
                        'oa_link',
                        'pub_title'
                    ]),
                ];
            }

            $client = app('Elasticsearch\Client');
            $response = $client->bulk($bulkParams);

            // Controllo degli errori
            if (isset($response['errors']) && $response['errors']) {
                foreach ($response['items'] as $item) {
                    if (isset($item['index']['error'])) {
                        Log::error('Failed to index document ' . $item['index']['_id'] . ': ' . json_encode($item['index']['error']));
                    }
                }
            }

            // Libera la memoria dopo ogni batch
            unset($bulkParams);
        });

        Log::info("Finished populating index");
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
                'id',
                'name',
                'code'
            ]),
            'subject' => $library->subject->only([
                'id',
                'name'
            ]),
            'institution' => [
                'id' => $library->institution->id,
                'name' => $library->institution->name,
                'institution_type' => $library->institution->institution_type->only([
                    'id',
                    'name'
                ]),
                'country' => $library->institution->country->only([
                    'id',
                    'name',
                    'code'
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

        if ($response['errors']) {
            echo "Elasticsearch index failed to populate";
            var_dump($response);
        } else {
            echo "Bulk indexing succesful.\n";
        }
    }
}
