@extends('mail.notification.custom_layout')
@include('mail.notification.block_library_data') 

@section('content')    
    <p>
    Una nueva biblioteca ha solicitado registrarse. Por favor, ve al panel de administración y resuelve la petición desde la Lista de Bibliotecas.
    </p>

    @yield('library_data')

    <div class="buttonBlock">
        <a href="{{ $notification_url }}" class="button">
           Clica aquí para ir al panel de administración
        </a>
    </div>    
@endsection