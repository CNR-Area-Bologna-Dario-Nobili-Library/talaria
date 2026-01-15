@extends('mail.notification.custom_layout')

@section('content')    
    <p>
    The library {{$name}} has been deleted. 
    </p>
    
    <p class="contacts">@lang('notification.comm_manager_contacts')</p>
@endsection