<?php

use App\Models\Users\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class UpdateUserModel extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */

    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('service_email')->nullable()->default(true);     
            $table->string('user_service_email')->nullable(false);                 
        });

        //set initial value for user_service_email=email field 
        //service_email=1 from DB default value
        User::withTrashed()            
            ->update([
                "user_service_email" => DB::raw("`email`"),                
            ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('service_email');   
            $table->dropColumn('user_service_email');            
        });
    }
}