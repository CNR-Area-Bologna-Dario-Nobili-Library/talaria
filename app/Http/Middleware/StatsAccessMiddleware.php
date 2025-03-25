<?php

namespace App\Http\Middleware;

use App\Models\Users\AbilitiesTransformer;
use Closure;
use Dingo\Api\Http\Response\Factory as ResponseFactory;
use Illuminate\Support\Facades\Log;
use League\Fractal\Manager;
use League\Fractal\Resource\Item;

class StatsAccessMiddleware
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
        $userabilities = $user->getAbilities();
        Log::info("User abilities: $userabilities");

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

        $fractal = new Manager();
        $resource = new Item($user, new AbilitiesTransformer());
        $abilities = $fractal->createData($resource)->toArray();

        //$userlibs = $user->abilities()->get()->pluck('entity_id');
        Log::info("User libraries:", $abilities);

        $libraryPermissions = $abilities['data']['libraries'];
        $hasAccess = collect($libraryPermissions)->contains(function ($item) use ($libraryId) {
            return $item['resource']['id'] == $libraryId;
            //? && in_array('manage', $item['permissions']); // If we want only library managers to see the stats
        });

        if (!$hasAccess) {
            return $response->errorForbidden('Access denied for this library');
            // return response()->json(['error' => 'Access denied for this library'], 403);
        }

        return $next($request);
    }
}
