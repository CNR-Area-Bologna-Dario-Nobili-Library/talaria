//TODO - Fix fields to be shown, decide what to include from patron request and not from borrowing request!

@include('mail.notification.block_reference_data') 

@section('patron_request')
    @isset($borrowing_library_name)
    <h3 class="library_data">@lang('globals.borrowing_library_data_header')</h3>     
    <b>@lang('globals.app.libraries.name'):</b> {{$borrowing_library_name}} <br/>
     @isset($borrowing_library_country)<b>@lang('globals.app.global.country'):</b> {{$borrowing_library_country}} <br/>@endisset
     @isset($borrowing_library_institution)<b>@lang('globals.app.libraries.institution_id'):</b> {{$borrowing_library_institution}} <br/>@endisset
     @isset($borrowing_library_ill_email) <b>@lang('globals.app.libraries.ill_email'):</b> {{$borrowing_library_ill_email}} <br/> @endisset
     @isset($borrowing_library_ill_phone) <b>@lang('globals.app.libraries.ill_phone'):</b> {{$borrowing_library_ill_phone}} <br/> @endisset   
    @endisset    
 
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
@endsection

@section('request_link')
    @isset($notification_url)
        @component('mail.notification.custom_button', ['url' => $notification_url])
           @lang('globals.request_link')
        @endcomponent    
    @endisset
@endsection