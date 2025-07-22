@extends('mail.notification.custom_layout')

@section('content')    
    <p>
        Benvenuto {{$name}} {{$surname}} nella nostra comunity! 
    </p>

    <p>
    <h3>Dati registrazione</h3>

    <b>Nome:</b> {{$name}} <br/>
    <b>Cognome:</b> {{$surname}}<br/>
    <b>Email:</b> {{$email}}<br/>

    </p>

    <div class="buttonBlock">
        <a href="{{ $notification_url }}" class="button">
           Clicca qui per fare il login
        </a>
    </div>    
@endsection