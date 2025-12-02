<?php

namespace App\Http\Controllers\Users;

use App\Models\Libraries\DepartmentTransformer;
use App\Models\Users\DatabaseNotificationTransformer;
use Illuminate\Http\Request;
use App\Http\Controllers\ApiController;
use App\Models\Users\DatabaseNotification;

class NotificationController extends ApiController
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(DatabaseNotification $model, DatabaseNotificationTransformer $transformer)
    {
        $this->model = $model;

        $this->transformer = $transformer;

        $this->broadcast = false;

        $this->talaria->disableAuthorize();
    }

    public function index(Request $request)
    {
        $collection = $this->talaria->index($this->model->owned()->select('*')->orderBy('created_at','desc'), $request, function($collection, $request)
        {
            if($request->has("readed"))
            {
                if(!$request->input("readed") || $request->input("readed") == "false")
                {
                    $collection->unreaded();
                }
                else
                {
                    $collection->readed();
                }
            }

            return $collection;
        },
            function($collection, $request)
            {
                // Set all messages queried to 'read'
                if($request->input('setToRead'))
                {
                    $collection->map(function ($item, $key) {
                        $item->setToRead();
                        return $item;
                    });
                }
                // Set all messages queried to 'unread'
                if($request->input('setToUnread'))
                {
                    $collection->map(function ($item, $key) {
                        $item->setToUnread();
                        return $item;
                    });
                }
                return $collection;
            });

        $unreaded_total = $this->model->owned()->unreaded()->count();

        return $this->response->paginator($collection, new $this->transformer())->addMeta('unreaded_total', $unreaded_total)->morph();
    }

    public function show(Request $request, $id)
    {
        $model = $this->talaria->show($this->model, $request, $id, function($model, $request)
        {
            // Set message to 'read'
            if($request->input('setToRead'))
            {
                $model->setToRead();
            }
            // Set message to 'unread'
            if($request->input('setToUnread'))
            {
                $model->setToUnread();
            }
            return $model;
        }, function($model, $request)
        {
            return $model->owned();
        });

        return $this->response->item($model, new $this->transformer())->setMeta($model->getInternalMessages())->morph();
    }

    public function markAllAsRead(Request $request)
    {
        \Log::info('User wants to mark all as read');
    
        if (!empty($this->validate))
            $this->validate($request, $this->validate);
    
        $notifications = \Auth::user()->unreadNotifications;
    
        if ($notifications->count()) {
            $notifications->markAsRead(); // ✅ persist read status
        }
    
        return $this->response->array([]);
    }
    

    public function markAllAsUnread(Request $request)
    {
        if (!empty($this->validate))
            $this->validate($request, $this->validate);

        $notifications = \Auth::user()->notifications()->whereNotNull('read_at')->get();

        foreach ($notifications as $notification) {
            $notification->read_at = null;
            $notification->save();
        }

        return $this->response->array([]);
    }

    public function markNotificationAsRead($id)
    {
        $notification = \Auth::user()->notifications()->where('id', $id)->firstOrFail();

        \Log::info('User updated notification', ['user_id' => auth()->id(), 'notification_id' => $id]);


        if ($notification->read_at === null) {
            $notification->read_at = now();
            $notification->save();
        }
        else
        {
            $notification->read_at = null;
            $notification->save();
        }

        return response()->json([
            'message' => 'Notification marked as read',
            'id' => $notification->id,
        ]);
    }
    public function destroy(Request $request, $id)
    {
        $notification = \Auth::user()->notifications()->where('id', $id)->firstOrFail();

        //\Log::info('User deleted notification', [
        //    'user_id' => auth()->id(),
        //    'notification_id' => $id,
        //]);

        $notification->forceDelete(); // Hard delete
        //$notification->delete(); // soft delete, need to do migration

        return response()->json([
            'message' => 'Notification deleted',
            'id' => $id,
        ]);
    }

     /**
     * Delete all notifications for the authenticated user
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroyMany(Request $request)
    {
        \Log::info('User requested bulk delete of notifications');
        \Log::info('User requested bulk delete of notifications', [
            'user_id' => auth()->id(),
            'ids' => $request->input('ids'),
        ]);

        $validated = $request->validate([
            'ids'   => 'required|array|min:1',
            'ids.*' => 'string', // notifications table uses string UUIDs by default
        ]);

        $user = \Auth::user();

        // Only delete notifications that belong to the authenticated user
        $query = $user->notifications()->whereIn('id', $validated['ids']);

        $count = (clone $query)->count();

        // Hard delete (to match your destroy())
        $query->forceDelete();

        \Log::info('User bulk deleted notifications', [
            'user_id' => auth()->id(),
            'deleted_count' => $count,
        ]);

        return response()->json([
            'message' => 'Selected notifications deleted successfully',
            'deleted_count' => $count,
            'deleted_ids' => $validated['ids'],
        ]);
    }

}
