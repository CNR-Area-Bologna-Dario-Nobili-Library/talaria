@extends('mail.notification.custom_layout')

@section('content')    
    <p> 
        ¡Hola!<br/> 
        
        Recibes este mensaje porque hemos recibido una solicitud de restablecimiento de contraseña para tu cuenta.
    </p>

    <div class="buttonBlock">
        <a href="{{ $notification_url }}" class="button">
        Clica aquí para restablecer su contraseña
        </a>
        <p class="text-muted">(Este restablecimiento de contraseña expirará en {{$count}} minutos)</p>
    </div>    

    <p>Si no solicitaste un restablecimiento de contraseña, no se requiere ninguna otra acción por tu parte.</p>
@endsection
