@extends('mail.notification.custom_layout')

@section('content')    
    <p>
        Gentile {{$name}} {{$surname}},<br/><br/>
        la biblioteca {{$lib_name}} ti ha rimosso come operator<br/>        
    </p>
@endsection