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
      0 => ["requestreceived"],
      1 => ["willsupply", "cancelrequested"],
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
      if (in_array($lending_status, $lendingStatusMap[0])) {
        if (!($model->lending_library_id)) {
          $aggregated_lending_status = "New";
        } else {
          $aggregated_lending_status = "In progress";
        }
      } elseif (in_array($lending_status, $lendingStatusMap[1])) {
        $aggregated_lending_status = "In progress";
      } elseif (in_array($lending_status, $lendingStatusMap[2])) {
        $aggregated_lending_status = "Fulfilled";
      } elseif (in_array($lending_status, $lendingStatusMap[3])) {
        $aggregated_lending_status = "Not fulfilled";
      } elseif (in_array($lending_status, $lendingStatusMap[4])) {
        $aggregated_lending_status = "Canceled";
      }
    }

    return [
      'aggregated_borrowing_status' => $aggregated_borrowing_status,
      'aggregated_lending_status'   => $aggregated_lending_status,
    ];
  }

  /**
   * Creates the query object.
   * @return array The query object
   */
  public static function createQuery($request)
  {
    $validated = $request->validate([
      'year' => 'sometimes|integer|min:2020|max:' . date('Y'),
      'library_id' => 'sometimes|integer|exists:libraries,id',
      'institution_id' => 'sometimes|integer|exists:institutions,id',
      'country_id' => 'sometimes|integer|exists:countries,id',
      'material_type' => 'sometimes|integer|min:1|max:5',
      // 'library_id' => 'sometimes|integer',
      // 'institution_id' => 'sometimes|integer',
      // 'country_id' => 'sometimes|integer'
    ]);

    $year = $validated['year'] ?? null;
    $library_id = $validated['library_id'] ?? null;
    $institution_id = $validated['institution_id'] ?? null;
    $country_id = $validated['country_id'] ?? null;
    $material_type = $validated['material_type'] ?? null;

    $globalFilters = [];

    if ($year) {
      $globalFilters[] = [
        'range' => [
          'request_date' => [
            'gte' => "{$year}-01-01",
            'lte' => "{$year}-12-31",
            'format' => 'yyyy-MM-dd'
          ]
        ]
      ];
    }

    if ($material_type) {
      $globalFilters[] = ['term' => ['reference.material_type' => $material_type]];
    }

    // Priority: Library >> Institution >> Country

    $idField = null;
    $idValue = null;

    if ($library_id) {
      $idField = [
        'borrowing' => 'borrowing_library.id',
        'lending' => 'lending_library.id'
      ];
      $idValue = $library_id;

      $globalFilters[] = [
        'bool' => [
          'should' => [
            ['term' => ['borrowing_library.id' => $library_id]],
            ['term' => ['lending_library.id' => $library_id]],
          ],
          'minimum_should_match' => 1
        ]
      ];
    } elseif ($institution_id) {
      $idField = [
        'borrowing' => 'borrowing_library.institution.id',
        'lending' => 'lending_library.institution.id'
      ];
      $idValue = $institution_id;

      $globalFilters[] = [
        'bool' => [
          'should' => [
            ['term' => ['borrowing_library.institution.id' => $institution_id]],
            ['term' => ['lending_library.institution.id' => $institution_id]],
          ],
          'minimum_should_match' => 1
        ]
      ];
    } elseif ($country_id) {
      $idField = [
        'borrowing' => 'borrowing_library.country.id',
        'lending' => 'lending_library.country.id'
      ];
      $idValue = $country_id;

      $globalFilters[] = [
        'bool' => [
          'should' => [
            ['term' => ['borrowing_library.country.id' => $country_id]],
            ['term' => ['lending_library.country.id' => $country_id]],
          ],
          'minimum_should_match' => 1
        ]
      ];
    }
    
    $query = count($globalFilters) > 0 ? ['bool' => ['filter' => $globalFilters]] : ['match_all' => (object)[]];

    return [
      'query' => $query,
      'agg_info' => [
        'borrowing_field' => $idField['borrowing'] ?? null,
        'lending_field' => $idField['lending'] ?? null,
        'query_id' => $idValue
      ],
    ];
  }
}
