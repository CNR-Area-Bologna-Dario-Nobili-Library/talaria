@extends('mail.notification.custom_layout')

@section('content')    
    <p>
        Gentile {{$name}} {{$surname}},<br/><br/>
        {{$entity_name}} ha rimosso le tue autorizzazioni da operatore.
    </p>
@endsection