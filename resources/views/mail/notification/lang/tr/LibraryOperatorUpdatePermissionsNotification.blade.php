@extends('mail.notification.custom_layout')

@section('content')    
    <p>
        Sayın {{$name}} {{$surname}},<br/><br/> 
        {{$lib_name}} adlı kütüphane operatör izinlerinizi güncelledi. <br/>
        İzinleriniz:
        @component('mail.notification.custom_permission_list', ['abilities' => $abilities])
        @endcomponent
    </p> 
@endsection