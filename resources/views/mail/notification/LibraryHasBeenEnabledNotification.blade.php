@extends('mail.notification.custom_layout')
@include('mail.notification.block_library_data') 

@section('content')    
    <p>
    {{ __('email.library_enabled') }}
    </p>

    @yield('library_data')

    <div class="buttonBlock">
        <a href="{{ $notification_url }}" class="button">
           {{ __('email.dashboard_link') }}
        </a>
    </div>    
@endsection