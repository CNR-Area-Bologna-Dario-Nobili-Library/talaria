@extends('mail.notification.custom_layout')

@section('content')    
    <p>
        Estimado/a {{$name}} {{$surname}},<br/><br/>
        La biblioteca {{$lib_name}} ha revocado estos permisos:
        @component('mail.notification.custom_permission_list', ['abilities' => $abilities])
        @endcomponent        
    </p>
@endsection