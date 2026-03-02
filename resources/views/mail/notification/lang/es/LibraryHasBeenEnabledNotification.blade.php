@extends('mail.notification.custom_layout')
@include('mail.notification.block_library_data') 

@section('content')    
    <p>
    La solicitud de registro de tu biblioteca ha sido aprobada. Por favor, inicia sesión y revisa, corrije o actualiza tus datos en el menú Biblioteca/Perfil. Ya puedes solicitar documentos de otras bibliotecas.
    </p>

    @yield('library_data')

    <div class="buttonBlock">
        <a href="{{ $notification_url }}" class="button">
           Clicar aquí para ir al panel de control.
        </a>
    </div>
    
    <p class="contacts">@lang('notification.comm_manager_contacts')</p>
@endsection