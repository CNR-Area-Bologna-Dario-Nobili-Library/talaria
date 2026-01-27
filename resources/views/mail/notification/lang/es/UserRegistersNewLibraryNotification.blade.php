@extends('mail.notification.custom_layout')
@include('mail.notification.block_library_data') 

@section('content')    
    <p>
    The library has been successfully registered, but you must wait for activation from the community manager.
    </p>

    @yield('library_data');

    <div class="buttonBlock">
        <a href="{{ $notification_url }}" class="button">
           Click here to go to dashboard
        </a>
    </div>    
@endsection