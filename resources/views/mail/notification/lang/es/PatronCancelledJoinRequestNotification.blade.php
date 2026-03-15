@extends('mail.notification.custom_layout')
@include('mail.notification.block_user_data') 

@section('content')    
    <p>
        El usuario canceló su solicitud de registro en tu biblioteca
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