<?php
namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AppNotificationEvent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $notification;

    public function __construct(array $notification)
    {
        $this->notification = $notification;
    }

    public function broadcastOn(): Channel
    {
        return new Channel('app-notifications');
    }

    public function broadcastAs(): string
    {
        return 'app.notification';
    }

    public function broadcastWith(): array
    {
        // WRAP IT - frontend expects e.notification
        return ['notification' => $this->notification];
    }
}