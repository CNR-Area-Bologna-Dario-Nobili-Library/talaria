<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Jobs\SyncElasticsearchIndex;

class SyncElasticsearch extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'elasticsearch:sync';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Synchronizes the Elasticsearch index with the MySQL database by creating the index (if not already present) and populating it';

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
        SyncElasticsearchIndex::dispatch();
        $this->info("Elasticsearch index synchronization dispatched");
    }
}
