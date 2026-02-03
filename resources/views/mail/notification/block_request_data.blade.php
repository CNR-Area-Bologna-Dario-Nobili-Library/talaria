@include('mail.notification.block_reference_data') 
@include('mail.notification.block_delivery_data') 
@include('mail.notification.block_user_data') 
@include('mail.notification.block_borrowing_library_data') 
@include('mail.notification.block_lending_library_data') 

@section('request')
    @yield('borrowing_library_data')

    @yield('lending_library_data')

    {{-- user will be included only when notification is sent to borrowing library --}}
    @yield('user_data')

    {{-- delivery desk will be included when notification is sent to borrowing library --}}
    @yield('delivery_data')

    @isset($request_id)
    <h3 class="request_data">@lang('globals.request_data_header')</h3>
    <b>@lang('globals.app.global.id'):</b> {{$request_id}} <br/>
        @isset($request_borrowing_status) <b>@lang('globals.app.requests.borrowing_status'):</b> @lang('globals.app.requests.'.$request_borrowing_status) <br/> @endisset 
        @isset($request_request_date) <b>@lang('globals.app.requests.request_date'):</b> {{$request_request_date}} <br/>  @endisset     
        @isset($request_request_note) <b>@lang('globals.app.requests.request_note'):</b> {{$request_request_note}} <br/> @endisset 
        @isset($request_borrowing_protnr)  <b>@lang('globals.app.requests.borrowing_protnr'):</b>{{$request_borrowing_protnr}} <br/> @endisset                
        @isset($request_request_special_delivery) @if ($request_request_special_delivery==1)  <b>@lang('globals.app.requests.request_special_delivery'):</b> @lang('globals.app.global.yes') <br/> @endif @endisset
        @isset($request_request_pdf_editorial)  @if ($request_request_pdf_editorial==1) <b>@lang('globals.app.requests.request_pdf_editorial'):</b> @lang('globals.app.global.yes') <br/> @endif @endisset            
        @isset($request_fulfill_location)  <b>@lang('globals.app.requests.fulfill_location'):</b>{{$request_fulfill_location}} <br/> @endisset        
        @isset($request_fulfill_inventorynr)  <b>@lang('globals.app.requests.fulfill_inventorynr'):</b>{{$request_fulfill_inventorynr}} <br/> @endisset        
        @isset($request_lending_protnr)  <b>@lang('globals.app.requests.lending_protnr'):</b>{{$request_lending_protnr}} <br/> @endisset       
        @isset($request_lending_status) <b>@lang('globals.app.requests.lending_status'):</b> @lang('globals.app.requests.'.$request_lending_status) <br/>  @endisset 
        @isset($request_fulfill_date) <b>@lang('globals.app.requests.fulfill_date'):</b> {{$request_fulfill_date}} <br/>@endisset 
        @isset($request_fulfill_type) <b>@lang('globals.app.requests.fulfill_type'):</b>             
                @switch($request_fulfill_type)
                    @case (1) @lang('globals.app.requests.deliveryMethod.file') <br/> @break
                    @case (2) @lang('globals.app.requests.deliveryMethod.mail') <br/> @break
                    @case (3) @lang('globals.app.requests.deliveryMethod.fax') <br/> @break
                    @case (4) @lang('globals.app.requests.deliveryMethod.url') <br/> @break
                    @case (5) @lang('globals.app.requests.deliveryMethod.articleexchange') <br/> @break
                    @case (6) @lang('globals.app.requests.deliveryMethod.other') <br/> @break
                @endswitch
        @endisset         
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
        @isset($request_fulfill_note) <b>@lang('globals.app.requests.fulfill_note'):</b> {{$request_fulfill_note}} <br/>   @endisset 
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