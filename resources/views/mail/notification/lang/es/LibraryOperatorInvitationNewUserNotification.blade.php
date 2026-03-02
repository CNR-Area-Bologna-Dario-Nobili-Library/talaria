@extends('mail.notification.custom_layout')

@section('content')    
    <p>
        Estimado/a {{$name}} {{$surname}},<br/><br/>
        La biblioteca {{$lib_name}} te ha invitado como operador<br/>
        Tus permisos son:
        @component('mail.notification.custom_permission_list', ['abilities' => $abilities])
        @endcomponent

        Parece que no tienes cuenta en el sistema. Tienes que registrarte primero.
    </p>

    <div class="buttonBlock">
        <a href="{{ $notification_url }}" class="button">
           Clica aquí para registrarte
        </a>
    </div>    
@endsection