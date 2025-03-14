<?php

namespace App\Console\Commands;

use App\Models\Institutions\Consortium;
use App\Models\Libraries\Library;
use App\Models\Users\User;
use Illuminate\Console\Command;

class RandomUserResources extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'random:user-resources';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

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
//        $u = User::whereCan('manage')->get();
//        $u = User::hasAbilitiesOn(Library::class)->get();
//        $u = User::hasAbilitiesOn(Library::find(16))->get();
        $u = User::hasAbilitiesOn(Consortium::find(5))->get();
        dd($u->toArray());
//        $macro = config('permissions.macro');
//        User::get()->each(function ($user) use ($macro) {
//            foreach ($macro as $model => $permissions) {
//                $model = config('constants.morphmap.'.$model);
//                print_r($model . "\n");
//                $count = $model::count();
//                print_r('CUNT ' . $count . "\n");
//                if ($model::count() > 0) {
//                    foreach ($permissions as $permission) {
//                        $user->allow($permission, $model::take(5)->get()->random());
//                    }
//                }
//            }
//        });
    }

}
