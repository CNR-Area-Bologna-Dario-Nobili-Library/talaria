<?php

namespace App\Helper;

use Illuminate\Support\Facades\Log;

class StatsHelper
{
  protected function getStatusMap($statusType)
  {
    /**
     * BORROWING STATUS AGGREGATIONS:
     * 0 => New = borrowingStatusMap[0]
     * 1 => In progress = borrowingStatusMap[1]
     * 2 => Received = borrowingStatusMap[2] - TRASHED (requests that have trash_type = 1)
     * 3 => Not received = borrowingStatusMap[3]
     * 4 => Canceled = borrowingStatusMap[4]
     * 5 => Reiterated = all the requests that have forward = 1
     * 6 => Not received but fulfilled by lender = borrowingStatusMap[6] + TRASHED (requests that have trash_type = 1)
     * 7 => Patron direct request -- not to display = borrowingStatusMap[7]
     */
    $borrowingStatusMap = [
      0 => ["newrequest"],
      1 => ["requested", "cancelrequested"],
      2 => ["deliveringtodesk", "deskreceived", "deliveredtouser", "fulfilled", "documentready"],
      3 => ["notdeliveredtouser", "notreceived", "notreceivedarchived"],
      4 => ["canceledaccepted", "canceled"],
      5 => [],
      6 => ["documentnotready"],
      7 => ["canceleddirect", "deliveredtouserdirect", "notdeliveredtouserdirect"]
    ];

    /**
     * LENDING STATUS AGGREGATIONS:
     * 0 => New requests that have no lender yet -- not to display => lending_status = NULL && aggregated_borrowing_status = 0
     * 1 => In progress = lendingStatusMap[1]
     * 2 => Fulfilled = lendingStatusMap[2]
     * 3 => Not fulfilled = lendingStatusMap[3]
     * 4 => Canceled = lendingStatusMap[4]
     * 6 => Archived as not received by borrower -- not to display => lending_status = NULL && archived = 1 && aggregated_borrowing_status = 3
     * 7 => Patron direct request -- not to display => lending_status = NULL && aggregated_borrowing_status = 7
     */
    $lendingStatusMap = [
      0 => null,
      1 => ["requestreceived", "willsupply", "cancelrequested"],
      2 => ["copycompleted"],
      3 => ["unfilled"],
      4 => ["canceledaccepted"],
      5 => [],
      6 => null,
      7 => null
    ];

    if ($statusType === 'borrowing') {
      return $borrowingStatusMap;
    } elseif ($statusType === 'lending') {
      return $lendingStatusMap;
    }

    return [];
  }

  /**
   * Computes the aggregated status for both borrowing and lending.
   * @param object $model The whole model object to evaluate the aggregated statuses
   * @return object An object containing aggregated_borrowing_status and aggregated_lending_status
   */
  public static function aggregateStatus($model)
  {
    // Get statuses aggregations
    $helper = new self();
    $borrowingStatusMap = $helper->getStatusMap("borrowing");
    $lendingStatusMap = $helper->getStatusMap("lending");

    // Normalize data
    $borrowing_status = strtolower($model->borrowing_status);
    $lending_status   = isset($model->lending_status) ? strtolower($model->lending_status) : null;
    $forward          = $model->forward;
    $trashed          = $model->trash_type;
    $archived         = $model->archived;
    $orphaned         = $model->all_lender;

    // ### Determine aggregated BORROWING status ###
    $aggregated_borrowing_status = null;

    if ($forward) {
      $aggregated_borrowing_status = 'Reiterated';
    } elseif (in_array($borrowing_status, $borrowingStatusMap[0])) {
      // New request
      $aggregated_borrowing_status = "New";
    } elseif (in_array($borrowing_status, $borrowingStatusMap[1])) {
      // In progress
      $aggregated_borrowing_status = "In progress";
    } elseif (in_array($borrowing_status, $borrowingStatusMap[2])) {
      // Received, but subtract if trashed
      if ($trashed) {
        $aggregated_borrowing_status = "Not received but fulfilled by lender";
      } else {
        $aggregated_borrowing_status = "Received";
      }
    } elseif (in_array($borrowing_status, $borrowingStatusMap[3])) {
      // Not received
      $aggregated_borrowing_status = "Not received";
    } elseif (in_array($borrowing_status, $borrowingStatusMap[4])) {
      // Canceled
      $aggregated_borrowing_status = "Canceled";
    } elseif (in_array($borrowing_status, $borrowingStatusMap[6])) {
      // Not received but fulfilled by lender (explicit)
      $aggregated_borrowing_status = "Not received but fulfilled by lender";
    } elseif (in_array($borrowing_status, $borrowingStatusMap[7])) {
      // Patron direct request -- only for tracking purposes
      $aggregated_borrowing_status = "Patron direct request";
    }

    // ### Determine aggregated LENDING status ###
    $aggregated_lending_status = null;

    if ($lending_status === null) {
      // No lending status provided -- only for tracking purposes
      if ($aggregated_borrowing_status === "New") {
        // New request (no lender yet)
        $aggregated_lending_status = "New";
      } elseif ($archived && $aggregated_borrowing_status === "Not received") {
        // Archived by borrower as not received
        $aggregated_lending_status = "Archived as not received";
      } elseif ($aggregated_borrowing_status === "Patron direct request") {
        // Patron direct request
        $aggregated_lending_status = "Patron direct request";
      }
    } else {
      // Lending status provided
      if (in_array($lending_status, $lendingStatusMap[1])) {
        // If a request is orphaned and awaiting to be taken it is New for Lender
        if ($orphaned == 1) {
          $aggregated_lending_status = "New";
        } else {
          $aggregated_lending_status = "In progress";
        }
      } elseif (in_array($lending_status, $lendingStatusMap[2])) {
        $aggregated_lending_status = "Fulfilled";
      } elseif (in_array($lending_status, $lendingStatusMap[3])) {
        $aggregated_lending_status = "Not fulfilled";
      } elseif (in_array($lending_status, $lendingStatusMap[4])) {
        $aggregated_lending_status = "Canceled";
      }
    }

    // Log::info($model['borrowing_status'] . " associated with " . $aggregated_borrowing_status);
    // Log::info($model['lending_status'] . " associated with " . $aggregated_lending_status);

    return [
      'aggregated_borrowing_status' => $aggregated_borrowing_status,
      'aggregated_lending_status'   => $aggregated_lending_status,
    ];
  }
}
