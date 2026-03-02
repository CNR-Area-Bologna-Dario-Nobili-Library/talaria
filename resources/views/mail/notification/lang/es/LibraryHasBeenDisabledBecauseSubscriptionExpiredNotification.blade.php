@extends('mail.notification.custom_layout')

@section('content')    
    <p>
    La biblioteca {{$name}} ha sido desactivada por actuación indadecuada. 
    </p>
    
    <p class="contacts">@lang('notification.comm_manager_contacts')</p>
@endsection