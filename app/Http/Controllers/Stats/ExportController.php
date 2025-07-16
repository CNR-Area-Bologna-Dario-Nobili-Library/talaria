<?php

namespace App\Http\Controllers\Stats;

use App\Helper\StatsHelper;
use App\Http\Controllers\Stats\BaseStatsController;
use App\Http\Controllers\Stats\Transformers\DocdelRequestStatsTransformer;
use Exception;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Log;

class ExportController extends BaseStatsController
{
  private function flattenArray(array $array, string $prefix = ''): array {
    $result = [];

    foreach ($array as $key => $value) {
        $newKey = $prefix === '' ? $key : $prefix . '.' . $key;

        if (is_array($value) && !empty($value) && array_keys($value) !== range(0, count($value) - 1)) {
            // Associative array: recurse
            $result += $this->flattenArray($value, $newKey);
        } else {
            // Scalar or numerically indexed array
            $result[$newKey] = $value;
        }
    }

    return $result;
  }


  public function __invoke(Request $request)
  {
    try {
      // Open PIT context
      $pitResponse = $this->client->openPointInTime([
        'index' => 'docdel_requests',
        'keep_alive' => '5m',
      ]);

      $pitId = $pitResponse['id'];
      $allHits = [];
      $searchAfter = null;

      $create_query = StatsHelper::createQuery($request);
      $query = $create_query['query'];

      do {
        $params = [
          'body' => [
            'size' => 1000,
            'query' => $query,
            'sort' => [
              ['created_at' => 'asc'],
              ['_shard_doc' => 'asc'] // tiebreaker in case of same created_at
            ],
            'pit' => [
              'id' => $pitId,
              'keep_alive' => '5m'
            ],
            '_source' => [
              'aggregated_borrowing_status',
              'aggregated_lending_status',
              'archived',
              'borrowing_library.country.code',
              'borrowing_library.country.name',
              'borrowing_library.institution.institution_type.name',
              'borrowing_library.institution.name',
              'borrowing_library.name',
              'borrowing_library.subject.name',
              'forward',
              'fulfill_date',
              'fulfill_type',
              'id',
              'lending_library.country.code',
              'lending_library.country.name',
              'lending_library.institution.institution_type.name',
              'lending_library.institution.name',
              'lending_library.name',
              'lending_library.subject.name',
              'notfulfill_type',
              'orphaned',
              'patron_docdel_request_id',
              'reference.doi',
              'reference.id',
              'reference.isbn',
              'reference.issn',
              'reference.issn_l',
              'reference.material_type',
              'reference.oa_link',
              'reference.pmid',
              'reference.pub_title',
              'reference.pubyear',
              'request_date',
              'trash_type'
            ]
          ]
        ];

        if ($searchAfter) {
          $params['body']['search_after'] = $searchAfter;
        }

        $response = $this->client->search($params);

        $hits = $response['hits']['hits'];

        $allHits = array_merge($allHits, $hits);

        $searchAfter = end($hits)['sort'] ? end($hits)['sort'] : null;
      } while (!empty($hits));

      // Close PIT context
      $this->client->closePointInTime(['body' => ['id' => $pitId]]);

      // Flatten hits
      $onlySources = array_map(function($hit) {
        return $this->flattenArray($hit['_source']);
      }, $allHits);

      /**
       * Transform exported data
       */

      $transformer = new DocdelRequestStatsTransformer(
        array_flip(config('constants.reference_material_type')),
        array_flip(config('constants.borrowingdocdelrequest_fulfill_type')),
        array_flip(config('constants.borrowingdocdelrequest_notfulfill_type'))
      );

      $requests = array_map([$transformer, 'transform'], $onlySources);
      
      /**
       * Send data to user through CSV file
       */
      return response()->streamDownload(function () use ($requests) {
        $handle = fopen('php://output', 'w');

        // Headers
        // If a change in column order is needed, update this array
        $columnOrder = [
          "borrowing_library.name",
          "borrowing_library.country.name",
          "borrowing_library.country.code",
          "borrowing_library.institution.name",
          "borrowing_library.institution.institution_type.name",
          "borrowing_library.subject.name",
          "lending_library.name",
          "lending_library.country.name",
          "lending_library.country.code",
          "lending_library.institution.name",
          "lending_library.institution.institution_type.name",
          "lending_library.subject.name",
          "reference.publication_type",
          "reference.issn",
          "reference.publication_year",
          "reference.oa_link",
          "reference.id",
          "request_id",
          "request_date",
          "fulfill_date",
          "aggregated_borrowing_status",
          "aggregated_lending_status",
          "delivery_method",
          "reason_unfilled",
          "orphaned",
          "forward",
          "archived",
          "trashed"
        ];

        // Write CSV header
        fputcsv($handle, $columnOrder);

        // Rows
        foreach ($requests as $row) {
          $csvRow = [];
          foreach ($columnOrder as $key) {
            $value = isset($row[$key]) ? $row[$key] : '';

            // Escape quotes if needed
            if (is_string($value)) {
              $value = str_replace('"', '""', $value);
            }

            $csvRow[] = $value;
          }
          fputcsv($handle, $csvRow);
        }

        fclose($handle);
      }, 'requests_distribution_stats_' . now()->format('Ymd_His') . '.csv', [
        'Content-Type' => 'text/csv',
      ]);
    } catch (Exception $e) {
      Log::error("Export failed: " . $e->getMessage());
      throw new Exception("Export failed. Please try again later.");
    }
  }
}