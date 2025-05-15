<?php

namespace App\Http\Middleware;

use Closure;
use Dingo\Api\Http\Response\Factory as ResponseFactory;
use Illuminate\Support\Facades\Log;

class LibraryStatsAccessMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        Log::info("Stats middleware invoked!");
        $response = app(ResponseFactory::class);
        // Log::info("Here's the request: $request");
        $user = $request->user();
        Log::info("User info: $user");

        $userroles = $user->getRoles();
        Log::info("User roles: $userroles");

        if ($user->isA('super-admin', 'manager')) {
            Log::info("Super user detected");
            return $next($request); // full access
        } else {
            Log::info("Normal user detected");
        }

        // Check for required library_id for regular users
        $libraryId = $request->input('library_id');

        if (!$libraryId) {
            return $response->errorBadRequest('library_id is required');
            // return response()->json(['error' => 'library_id is required'], 400);
        }

        //! The following code works even if the library is not enabled.

        $userAbilities = $user->abilities()->get();

        $hasAccess = $userAbilities->contains(function ($ability) use ($libraryId) {
            return $ability->entity_id == $libraryId;
            // && in_array('manage', $ability->permissions); // If we want only library managers to see the stats
        });

        if (!$hasAccess) {
            return $response->errorForbidden('Access denied for this library');
        }

        return $next($request);
    }
}
