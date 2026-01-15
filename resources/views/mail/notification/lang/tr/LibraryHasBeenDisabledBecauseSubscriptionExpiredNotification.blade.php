@extends('mail.notification.custom_layout')

@section('content')    
    <p>
    The library {{$name}} has been disabled for bad behaviour. 
    </p>
    
    <p class="contacts">@lang('notification.comm_manager_contacts')</p>
@endsection