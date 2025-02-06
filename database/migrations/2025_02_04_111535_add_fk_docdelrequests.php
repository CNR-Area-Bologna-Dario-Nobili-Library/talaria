<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFkDocdelrequests extends Migration
{
    public function up()
    {
        Schema::table('docdel_requests', function (Blueprint $table) {
            $table->bigInteger('borrowing_library_id')->unsigned()->change();
            $table->bigInteger('lending_library_id')->unsigned()->change(); 
            $table->foreign('borrowing_library_id')->references('id')->on('libraries')->onDelete("restrict");
            $table->foreign('lending_library_id')->references('id')->on('libraries')->onDelete("restrict");
         });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('docdel_requests', function (Blueprint $table) {
            $table->dropForeign('docdel_requests_borrowing_library_id_foreign');
            $table->dropForeign('docdel_requests_lending_library_id_foreign');
        });

    }
}
