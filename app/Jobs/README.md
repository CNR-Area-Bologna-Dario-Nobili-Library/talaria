# Jobs
 Job queue is managed by `laravelqueue` container that runs `php artisan queue:work` at boot (so `Redis` is not used for this)

[Laravel jobs queue documentation](https://laravel.com/docs/6.x/queues#running-the-queue-worker)


To run manually jobs you can do:

`php artisan job:dispatch YourJobNameHere`

or you can run Job directly from `Tinker`; 

`dispatch_now(new MyJob(new MyArgs()))`
