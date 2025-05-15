<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Jobs\InitializeElasticsearchIndex;

class InitializeElasticsearch extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'elasticsearch:init';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Initializes Elasticsearch index by creating and populating it';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        InitializeElasticsearchIndex::dispatch();
        $this->info("Elasticsearch index initialization dispatched");
    }
}
