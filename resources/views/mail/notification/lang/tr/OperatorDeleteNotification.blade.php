@extends('mail.notification.custom_layout')

@section('content')    
    <p>
        Sayın {{$name}} {{$surname}},<br/><br/> 
        {{$entity_name}} operatör izinlerinizi iptal etti.
    </p>
@endsection