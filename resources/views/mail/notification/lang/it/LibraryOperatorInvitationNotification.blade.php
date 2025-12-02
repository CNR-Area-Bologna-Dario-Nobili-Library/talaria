@extends('mail.notification.custom_layout')

@section('content')    
    <p>
        Gentile {{$name}} {{$surname}},<br/><br/>
        la biblioteca {{$lib_name}} ti ha invitato come operatore<br/>
        I tuoi permessi sono:    
        @component('mail.notification.custom_permission_list', ['abilities' => $abilities])
        @endcomponent
    </p>

    <div class="buttonBlock">
        <a href="{{ $notification_url }}" class="button">
           Clicca qui per accettare/rifiutare
        </a>
    </div>    
@endsection