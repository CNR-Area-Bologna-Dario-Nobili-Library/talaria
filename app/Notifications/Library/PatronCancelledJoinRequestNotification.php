<?php

namespace App\Notifications\Library;

use App\Notifications\BaseNotification;
use Illuminate\Bus\Queueable;

/**
 * Notification sent to library operators when a patron cancels their join request.
 */
class PatronCancelledJoinRequestNotification extends BaseNotification
{
    use Queueable;

    /**
     * Create a new notification instance.
     *
     * @param $model LibraryUser model being deleted
     * @return void
     */
    public function __construct($model)
    {
        parent::__construct();

        $this->url = config('app.frontend_url').'/library/'.$model->library_id."/patrons";

        $user = $model->user;

        if (isset($user)) {
            $userArray = $user->toArray();
            foreach ($userArray as $k => $v) {
                if (isset($v) && !empty($v)) {
                    $this->extraDataArr["user_".$k] = $v;
                }
            }
        }

        // Include library_id in extra data for frontend matching
        $this->extraDataArr['library_id'] = $model->library_id;
    }
}
