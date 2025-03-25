<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateLibraryUserModel extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('library_user', function (Blueprint $table) {
            $table->dropColumn('user_service_phone');
            $table->dropColumn('user_service_email');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('library_user', function (Blueprint $table) {
            $table->string('user_service_phone')->nullable()->before('status');
            $table->string('user_service_email')->nullable()->before('status');
        });
    }
}
