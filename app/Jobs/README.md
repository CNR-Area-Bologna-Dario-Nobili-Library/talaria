# Jobs
[Laravel jobs queue documentation](https://laravel.com/docs/6.x/queues#running-the-queue-worker)

 Job queue is managed by `laravelqueue` container that runs `php artisan queue:work` at boot (so `Redis` is not used for this)

To run manually jobs you can do:

`php artisan job:dispatch YourJobNameHere`

or you can run Job directly from `Tinker`; 

`dispatch_now(new MyJob(new MyArgs()))`

# Scheduled Jobs
To debug scheduled job you can use: `php artisan schedule:run` 
Every job that is run in the Kernel->schedule() function is automatically added to queue (based on its schedule) but in order to be runned you need an active WORKER
To start a worker: `php artisan queue:work` (this process will live unless we stop it)
If code change we've to manually restart worker using: `php artisan queue:restart` and better to clear cache befor restarting worker doing  `php artisan cache:clear`

In a production server you may need to add sheduler to a crontab to check for scheduled job like:
`* * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1`
and run `php artisan queue:work` regularly using this cron or using a `supervisor` that checks if worker is still alive 

# Usefull Laravel commands for monitoring and managing your queues
`queue:work: Process new jobs as they are pushed onto the queue`
`queue:listen: Similar to queue:work, but will reload the worker after each job`
`queue:retry: Retry a failed job`
`queue:failed: List all of the failed jobs`
`queue:flush: Delete all of the failed jobs`
