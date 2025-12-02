@extends('mail.notification.custom_layout')

@section('content')    
    <p>
        Operator invitation was rejected by {{$name}} {{$surname}}
    </p> 
@endsection