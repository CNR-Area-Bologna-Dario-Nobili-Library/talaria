@extends('mail.notification.custom_layout')

@section('content')    
    <p>
        Dear {{$name}} {{$surname}},<br/><br/>
        the library {{$lib_name}} removed you as operator<br/>        
    </p>
@endsection