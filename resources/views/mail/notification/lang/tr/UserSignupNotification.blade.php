@extends('mail.notification.custom_layout')
@include('mail.notification.block_user_data') 

@section('content')    
    <p>
        {{$user_name}} {{$user_surname}} Topluluğumuza hoş geldiniz!
    </p>

    @yield('user_data');

    <div class="buttonBlock">
        <a href="{{ $notification_url }}" class="button">
           Giriş yapmak için tıklayınız
        </a>
    </div>    
@endsection