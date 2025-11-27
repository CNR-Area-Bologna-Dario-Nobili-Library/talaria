@extends('mail.notification.custom_layout')

@section('content')    
    <p>
        Dear {{$name}} {{$surname}},<br/><br/>
        {{$entity_name}} removed your operator permissions.
    </p>
@endsection