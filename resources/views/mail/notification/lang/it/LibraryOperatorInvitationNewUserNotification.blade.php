@extends('mail.notification.custom_layout')

@section('content')    
    <p>
        Gentile {{$name}} {{$surname}},<br/><br/>
        la biblioteca {{$lib_name}} ti ha invitato come operatore<br/>
        I tuoi permessi sono: 
        @component('mail.notification.custom_permission_list', ['abilities' => $abilities])
        @endcomponent

        Sembra che tu non abbia ancora un account nel sistema, quindi ti devi prima registrare!
    </p>

    <div class="buttonBlock">
        <a href="{{ $notification_url }}" class="button">
           Clicca qui per registrarti
        </a>
    </div>    
@endsection
