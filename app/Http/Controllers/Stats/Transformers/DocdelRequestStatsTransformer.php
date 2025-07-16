<?php

namespace App\Http\Controllers\Stats\Transformers;

class DocdelRequestStatsTransformer {
  protected $materialTypeMap;
  protected $fulfillTypeMap;
  protected $notFulfillTypeMap;

  public function __construct($materialTypeMap, $fulfillTypeMap, $notFulfillTypeMap) {
    $this->materialTypeMap = $materialTypeMap;
    $this->fulfillTypeMap = $fulfillTypeMap;
    $this->notFulfillTypeMap = $notFulfillTypeMap;
  }

  public function transform($request) {
    /* Set string values instead of numbers */
    if (isset($request['fulfill_type']) && isset($this->fulfillTypeMap[$request['fulfill_type']])) {
      $request['fulfill_type'] = $this->fulfillTypeMap[$request['fulfill_type']];
    }

    if (isset($request['notfulfill_type']) && isset($this->notFulfillTypeMap[$request['notfulfill_type']])) {
      $request['notfulfill_type'] = $this->notFulfillTypeMap[$request['notfulfill_type']];
    }

    if (isset($request['reference.material_type']) && isset($this->materialTypeMap[$request['reference.material_type']])) {
      $request['reference.material_type'] = $this->materialTypeMap[$request['reference.material_type']];
    }

    /* Rename fields */
    $map = [
      'fulfill_type' => 'delivery_method',
      'id' => 'request_id',
      'notfulfill_type' => 'reason_unfilled',
      'patron_docdel_request_id' => 'patron_request_id',
      'reference.material_type' => 'reference.publication_type',
      'reference.pub_title' => 'reference.publication_title',
      'reference.pubyear' => 'reference.publication_year',
      'trash_type' => 'trashed'
    ];

    foreach ($map as $oldKey => $newKey) {
      if (array_key_exists($oldKey, $request)) {
        $request[$newKey] = $request[$oldKey];
        unset($request[$oldKey]);
      }
    }

    return $request;
  }
}