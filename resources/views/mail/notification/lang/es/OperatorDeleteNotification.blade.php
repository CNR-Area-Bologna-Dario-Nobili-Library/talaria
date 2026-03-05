@extends('mail.notification.custom_layout')

@section('content')    
    <p>
        Estimado/a {{$name}} {{$surname}},<br/><br/>
        {{$entity_name}} canceló tus permisos como operador/a.
    </p>
@endsection