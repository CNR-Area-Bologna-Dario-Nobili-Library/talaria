@extends('mail.notification.custom_layout')
@include('mail.notification.block_delivery_data') 
@include('mail.notification.block_reference_data') 
@include('mail.notification.block_user_data') 

@section('content')                              
                    
        @yield('user_data')

        {{-- delivery desk will be included when notification is sent to borrowing library --}}
        @yield('delivery_data')
            
        @isset($request_id)
        <h3 class="request_data">@lang('globals.request_data_header')</h3>
        <b>@lang('globals.app.global.id'):</b> {{$request_id}} <br/>
            @isset($request_status) <b>@lang('globals.app.requests.status'):</b> @lang('globals.app.requests.'.$request_status) <br/> @endisset 
            @isset($request_request_date) <b>@lang('globals.app.requests.request_date'):</b> {{$request_request_date}} <br/>  @endisset     
            @isset($request_fulfill_date) <b>@lang('globals.app.requests.fulfill_date'):</b> {{$request_fulfill_date}} <br/>@endisset 
            @isset($request_cancel_date) <b>@lang('globals.app.requests.cancel_date'):</b> {{$request_cancel_date}} <br/>@endisset 

            @isset($request_forlibrary_note) <b>@lang('globals.app.requests.forLibraryNotes'):</b> {{$request_forlibrary_note}} <br/> @endisset    
            @isset($request_fromlibrary_note) <b>@lang('globals.app.patronrequest.fromlibrary_note'):</b> {{$request_fromlibrary_note}} <br/> @endisset    

            @isset($request_notfulfill_type) <b>@lang('globals.app.patronrequest.notfulfill_type'):</b>             
                    @switch($request_notfulfill_type)
                        @case (1) @lang('globals.app.patronrequest.notfulfill_type.NotAvailable') <br/> @break
                        @case (2) @lang('globals.app.patronrequest.notfulfill_type.PatronNotEnabled') <br/> @break
                        @case (3) @lang('globals.app.patronrequest.notfulfill_type.PatronNotTake') <br/> @break
                        @case (4) @lang('globals.app.patronrequest.notfulfill_type.PatronNotAcceptCost') <br/> @break
                        @case (5) @lang('globals.app.patronrequest.notfulfill_type.PatronNotAnswerCost') <br/> @break 
                        @case (6) @lang('globals.app.patronrequest.notfulfill_type.NotAvailableForFree') <br/> @break 
                        @case (7) @lang('globals.app.patronrequest.notfulfill_type.WrongRef') <br/> @break
                        @case (8) @lang('globals.app.patronrequest.notfulfill_type.DeskLost') <br/> @break                        
                    @endswitch
            @endisset                 
        @endisset

        @yield('reference')
    

    @isset($notification_url)
            @component('mail.notification.custom_button', ['url' => $notification_url])
            @lang('globals.request_link')
            @endcomponent    
    @endisset
    
@endsection
