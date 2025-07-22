@extends('mail.notification.custom_layout')

@section('content')    
    <p>
    Your library registration request has been approved. Please login and revise your library data, correct or update them in your Library/Profile menu. Now you can start to request documents from the other libraries
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