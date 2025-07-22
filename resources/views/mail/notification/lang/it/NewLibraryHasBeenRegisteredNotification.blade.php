@extends('mail.notification.custom_layout')

@section('content')    
    <p>
    Una nuova biblioteca è stata registrata. Accedi all'interfaccia di admin per gestire la richiesta.
    </p>

    <p>
    <h3>Dati registrazione</h3>

    <b>Nome Biblioteca:</b> {{$name}} <br/>
    <b>Indirizzo:</b> {{$address}}<br/>
    <b>DD/ILL Email:</b> {{$ill_email}}<br/>

    </p>

    <div class="buttonBlock">
        <a href="{{ $notification_url }}" class="button">
           Clicca qui per accedere alla dashboard di admin
        </a>
    </div>    
@endsection