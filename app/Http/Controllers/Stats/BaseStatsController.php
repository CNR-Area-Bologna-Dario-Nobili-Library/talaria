<?php

namespace App\Http\Controllers\Stats;

use App\Http\Controllers\AdminApiController;
use Illuminate\Support\Facades\Log;

class BaseStatsController extends AdminApiController
{
  protected $client;

  public function __construct()
  {
    parent::__construct();

    $this->client = app('Elasticsearch\Client');
  }
}
