<?php

namespace App\Providers;

use Elasticsearch\ClientBuilder;
use Illuminate\Support\ServiceProvider;

class ElasticsearchServiceProvider extends ServiceProvider
{
  /**
   * Register services.
   *
   * @return void
   */
  public function register()
  {
    // Create a singleton Elasticsearch client that creates a new client
    $this->app->singleton('Elasticsearch\Client', function ($app) {
      $config = config('elasticsearch');
      
      $client = ClientBuilder::create()
          ->setHosts($config['hosts']);

      if (!empty($config['retries'])) {
          $client->setRetries($config['retries']);
      }

      if (!empty($config['api_key'])) {
          $client->setApiKey($config['api_key']['id'], $config['api_key']['key']);
      }

      if (!empty($config['ssl_verification'])) {
          $client->setSSLVerification($config['ssl_verification']);
      }

      return $client->build();
    });
  }

  /**
   * Bootstrap services.
   *
   * @return void
   */
  public function boot()
  {
    //
  }
}