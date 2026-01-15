@extends('mail.notification.custom_layout')
@include('mail.notification.block_borrowing_library_data') 

@section('content')    
    <p>
    A new library has requested registration. Please go in the admin dashboard and manage the request from the Libraries list.
    </p>

    @yield('borrowing_library_data')

    <div class="buttonBlock">
        <a href="{{ $notification_url }}" class="button">
           Click here to go to admin dashboard
        </a>
    </div>    
@endsection