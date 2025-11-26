@extends('mail.notification.custom_layout')

@section('content')    
    <p>
        Gentile {{$name}} {{$surname}},<br/><br/>
        la biblioteca {{$lib_name}} ha modificato i tuoi permessi da operatore<br/>
        I tuoi permessi sono:   
        @component('mail.notification.custom_permission_list', ['abilities' => $abilities])
        @endcomponent
    </p> 
@endsection