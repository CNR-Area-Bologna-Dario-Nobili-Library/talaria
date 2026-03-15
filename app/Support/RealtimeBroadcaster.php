<?php
namespace App\Support;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use App\Models\Users\User;
use App\Notifications\BaseNotification;
use App\Events\AppNotificationEvent;

class RealtimeBroadcaster
{
    public static function fromNotification(
        $model, 
        ?User $notifiable, 
        BaseNotification $notification
    ): void {
        $payload = method_exists($notification, 'toRealtimePayload')
            ? (array) $notification->toRealtimePayload($notifiable)
            : [];

        $payload['notifier_id'] = optional(Auth::user())->id;
        $payload['target_user_id'] = optional($notifiable)->id;
        $payload['request_id'] = $payload['request_id'] ?? null;
        $payload['timestamp'] = $payload['timestamp'] ?? now()->toIso8601String();

        // Single unified broadcast - NO instanceof checks needed
        /*Log::info('🔔 Broadcasting unified notification', [
            'type' => $payload['type'] ?? 'generic',
            'target_user' => $notifiable->id ?? null            
        ]);*/        
        // Only one event needed!
        event(new AppNotificationEvent($payload));
    }
}