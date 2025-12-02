@extends('mail.notification.custom_layout')
@include('mail.notification.block_user_data') 

@section('content')    
    <p>
        Welcome {{$user_name}} {{$user_surname}} in our  community!
    </p>

    @yield('user_data');

    <div class="buttonBlock">
        <a href="{{ $notification_url }}" class="button">
           Click here to login
        </a>
    </div>    
@endsection