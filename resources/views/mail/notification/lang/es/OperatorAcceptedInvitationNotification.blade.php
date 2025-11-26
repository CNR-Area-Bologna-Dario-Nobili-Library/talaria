@extends('mail.notification.custom_layout')

@section('content')    
    <p>
        Operator invitation was accepted by {{$name}} {{$surname}}
    </p> 
@endsection