<?php

/* NOTE: this controller uses standard dispatch method so it can run without "filter" or policy 
and uses AdminApiController that disable authorization/permission/abilities*/

namespace App\Http\Controllers\Stats;

use App\Models\Institutions\Institution;
use App\Models\Institutions\InstitutionTransformer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Stats\BaseStatsController;

use Illuminate\Support\Facades\Log;

class AdminStatsController extends BaseStatsController
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();

        $this->broadcast = false;
        // $this->client = app('Elasticsearch\Client');
    }
}
