@extends('mail.notification.custom_layout')

@section('content')    
    <p>
        Dear {{$name}} {{$surname}},<br/><br/>
        the library {{$lib_name}} has removed these permissions: 
        @component('mail.notification.custom_permission_list', ['abilities' => $abilities])
        @endcomponent        
    </p>
@endsection