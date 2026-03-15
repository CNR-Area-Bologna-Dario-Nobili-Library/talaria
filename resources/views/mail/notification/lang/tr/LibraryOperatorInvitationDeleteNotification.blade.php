@extends('mail.notification.custom_layout')

@section('content')    
    <p>
        Sayın {{$name}} {{$surname}},<br/><br/> 
        {{$lib_name}} adlı kütüphane bu izinleri kaldırdı. 
        @component('mail.notification.custom_permission_list', ['abilities' => $abilities])
        @endcomponent        
    </p>
@endsection