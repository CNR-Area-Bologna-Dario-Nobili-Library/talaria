@extends('mail.notification.custom_layout')
@include('mail.notification.block_user_data') 

@section('content')    
    <p>
        {{ __('email.welcome', ['user_name' => $user_name, 'user_surname' => $user_surname]) }}
    </p>

    @yield('user_data')

    <div class="buttonBlock">
        <a href="{{ $notification_url }}" class="button">
           {{ __('email.login_link') }}
        </a>
    </div>    
@endsection