@extends('mail.notification.custom_layout')

@section('content')    
    <p>
    The library {{$name}} has to renew its subscription. 
    </p>
    
    <p class="contacts">@lang('notification.comm_manager_contacts')</p>
@endsection