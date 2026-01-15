@extends('mail.notification.custom_layout')

@section('content')    
    <p>
    La biblioteca {{$name}} deve rinnovare la sottoscrizione. 
    </p>
    <p class="contacts">@lang('notification.comm_manager_contacts')</p>      
@endsection