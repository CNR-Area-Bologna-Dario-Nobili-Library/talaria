@extends('mail.notification.custom_layout')
@include('mail.notification.block_user_data') 

@section('content')    
    <p>
        Kullanıcı sizin kütüphanenize kayıt talebini iptal etti
    </p>

    <p>
    @yield('user_data')
    </p>

    <div class="buttonBlock">
        <a href="{{ $notification_url }}" class="button">
             @lang('globals.users_list_link')
        </a>
    </div>    
@endsection