@extends('mail.notification.custom_layout')
@include('mail.notification.block_user_data') 

@section('content')    
    <p>
        Benvenuto {{$user_name}} {{$user_surname}} nella nostra comunity! 
    </p>

    @yield('user_data')

    <div class="buttonBlock">
        <a href="{{ $notification_url }}" class="button">
           Clicca qui per fare il login
        </a>
    </div>    
@endsection