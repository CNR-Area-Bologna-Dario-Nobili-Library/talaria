@extends('mail.notification.custom_layout')

@section('content')    
    <p>
        {{ __('email.dear', ['name' => $name, 'surname' => $surname]) }} <br/><br/>
        {{ __('email.library_operator_updated_permissions', ['lib_name' => $lib_name]) }} <br/>
        {{ __('email.library_operator_permissions_list') }}
        @component('mail.notification.custom_permission_list', ['abilities' => $abilities])
        @endcomponent
    </p> 
@endsection