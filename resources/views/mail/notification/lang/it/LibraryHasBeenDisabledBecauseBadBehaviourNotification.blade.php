@extends('mail.notification.custom_layout')

@section('content')    
    <p>
    La biblioteca {{$name}} è stata disattivata per cattivo comportamento. 
    </p>
        
    <p class="contacts">@lang('notification.comm_manager_contacts')</p>
@endsection