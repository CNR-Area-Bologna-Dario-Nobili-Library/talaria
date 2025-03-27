<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddStatusConsortium extends Migration
{
   /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('consortia', function (Blueprint $table) {
            $table->tinyInteger('status')->nullable(true)->after('name');                        
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('consortia', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
}
