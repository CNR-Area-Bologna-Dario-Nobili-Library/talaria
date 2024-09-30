<?php

// Fill the Elasticsearch client config params from the env variables
return [
  'hosts' => [
        env('ELASTICSEARCH_HOST', 'localhost:9200'),
    ],

    // 'retries' => env('ELASTICSEARCH_RETRIES', 2),

    'api_key' => [
        'id' => env('ELASTICSEARCH_API_KEY_ID', null),
        'key' => env('ELASTICSEARCH_API_KEY_KEY', null),
    ],

    'ssl_verification' => env('ELASTICSEARCH_SSL_VERIFICATION', true),
];