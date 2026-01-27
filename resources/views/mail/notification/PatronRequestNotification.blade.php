@extends('mail.notification.custom_layout')
@include('mail.notification.block_reference_data') 
@include('mail.notification.block_user_data') 
@include('mail.notification.block_library_data') 
@include('mail.notification.block_delivery_data') 

@section('content')                              

        
    @yield('library_data')

    @yield('delivery_data')
 
    @isset($request_id)
    <h3 class="request_data">@lang('globals.request_data_header')</h3>
    <b>@lang('globals.app.global.id'):</b> {{$request_id}} <br/>
        @isset($request_borrowing_status) <b>@lang('globals.app.requests.borrowing_status'):</b> @lang('globals.app.requests.'.$request_borrowing_status) <br/> @endisset 
        @isset($request_request_date) <b>@lang('globals.app.requests.request_date'):</b> {{$request_request_date}} <br/>  @endisset     
        @isset($request_request_note) <b>@lang('globals.app.requests.request_note'):</b> {{$request_request_note}} <br/> @endisset    
        @isset($request_lending_status) <b>@lang('globals.app.requests.lending_status'):</b> @lang('globals.app.requests.'.$request_lending_status) <br/>  @endisset 
        @isset($request_fulfill_date) <b>@lang('globals.app.requests.fulfill_date'):</b> {{$request_fulfill_date}} <br/>@endisset 
        @isset($request_notfulfill_type) <b>@lang('globals.app.requests.notfulfill_type'):</b>             
                @switch($request_notfulfill_type)
                    @case (1) @lang('globals.app.requests.notfulfill_type.NotAvailableForILL') <br/> @break
                    @case (2) @lang('globals.app.requests.notfulfill_type.NotHeld') <br/> @break
                    @case (3) @lang('globals.app.requests.notfulfill_type.NotOnShelf') <br/> @break
                    @case (4) @lang('globals.app.requests.notfulfill_type.ILLNotPermittedByLicense') <br/> @break
                    @case (5) @lang('globals.app.requests.notfulfill_type.WrongRef') <br/> @break 
                    @case (6) @lang('globals.app.requests.notfulfill_type.MaxReqNumber') <br/> @break 
                    @case (7) @lang('globals.app.requests.notfulfill_type.Other') <br/> @break
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
