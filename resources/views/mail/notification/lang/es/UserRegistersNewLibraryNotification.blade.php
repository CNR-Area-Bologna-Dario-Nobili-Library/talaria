@extends('mail.notification.custom_layout')
@include('mail.notification.block_library_data') 

@section('content')    
    <p>
    La biblioteca se ha registrado correctamente, pero tienes que esperar la activación por parte del administrador de la comunidad.
    </p>

    @yield('library_data');

    <div class="buttonBlock">
        <a href="{{ $notification_url }}" class="button">
           Clica aquí para ir al panel de control
        </a>
    </div>    
@endsection