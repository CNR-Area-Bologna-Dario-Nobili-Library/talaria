<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTemporaryAbilitiesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('temporary_abilities', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('created_by')->unsigned()->nullable();
            $table->integer('updated_by')->unsigned()->nullable();
            $table->timestamps();     
            $table->integer('entity_id')->unsigned()->nullable(false);
            $table->string('entity_type')->nullable(false);
            $table->bigInteger('user_id')->unsigned()->nullable(true);
            $table->string('user_name')->nullable(true);
            $table->string('user_surname')->nullable(true);
            $table->string('user_email')->nullable(true);
            $table->string('abilities')->nullable(false);
            $table->smallInteger('status')->nullable(false)->defaul(0);                        
            $table->foreign('user_id')->references('id')->on('users');            
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('temporary_abilities', function (Blueprint $table) {        
            $table->dropForeign('temporary_abilities_user_id_foreign');
        });

        Schema::dropIfExists('temporary_abilities');
        
    }
}