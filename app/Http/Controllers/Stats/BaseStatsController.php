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

  protected function getStatusMap($statusType)
  {
    /**
     * BORROWING STATUS AGGREGATIONS:
     * 0 => New
     * 1 => In progress
     * 2 => Received
     * 3 => Not received
     * 4 => Canceled
     * 5 => Reiterated
     * 6 => Not received but fulfilled by lender
     */
    $borrowingStatusMap = [
      0 => ["newrequest"],
      1 => ["requested"],
      2 => ["deliveringtodesk", "deskreceived", "deliveredtouser", "fulfilled", "documentready"],
      3 => ["notdeliveredtouser", "notreceived", "notreceivedarchived"],
      4 => ["canceledrequested", "canceledaccepted", "canceled"],
      5 => [],
      6 => ["documentnotready"]
    ];

    /**
     * LENDING STATUS AGGREGATIONS:
     * 0 => New requests that have no lender yet -- not to display
     * 1 => In progress
     * 2 => Fulfilled
     * 3 => Not fulfilled
     * 4 => Canceled
     * 5 => Reiterated
     * 6 => Archived as not received by borrower -- not to display
     */
    $lendingStatusMap = [
      0 => null,
      1 => ["requestreceived", "willsupply"],
      2 => ["copycompleted"],
      3 => ["unfilled"],
      4 => ["canceledaccepted", "canceledrequested"],
      5 => [],
      6 => null
    ];

    if ($statusType === 'borrowing') {
      return $borrowingStatusMap;
    } elseif ($statusType === 'lending') {
      return $lendingStatusMap;
    }

    return [];
  }
}
