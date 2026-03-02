@extends('mail.notification.custom_layout')
@include('mail.notification.block_user_data') 

@section('content')    
    <p> 
        ¡Bienvenido/a {{$user_name}} {{$user_surname}} a nuestra comunidad!
    </p>

    @yield('user_data');

    <div class="buttonBlock">
        <a href="{{ $notification_url }}" class="button">
           Clica aquí para iniciar sesión
        </a>
    </div>    
@endsection