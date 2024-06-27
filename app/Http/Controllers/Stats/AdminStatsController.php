<?php

/* NOTE: this controller uses standard dispatch method so it can run without "filter" or policy 
and uses AdminApiController that disable authorization/permission/abilities*/

namespace App\Http\Controllers\Stats;

use App\Models\Institutions\Institution;
use App\Models\Institutions\InstitutionTransformer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\AdminApiController;

class AdminStatsController extends AdminApiController
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->broadcast = false;
    }

    //Elastic Search TEST API
    public function eltest(Request $request)
    {                     
        return ["a"=>3,"b"=>"test"];
    }

    


}    
