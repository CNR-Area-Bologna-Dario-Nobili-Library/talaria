@extends('mail.notification.custom_layout')

@section('content')    
    <p>
    {{ __('email.library_disabled', ['name' => $name]) }}
    </p>
    
    <p class="contacts">@lang('notification.comm_manager_contacts')</p>
@endsection