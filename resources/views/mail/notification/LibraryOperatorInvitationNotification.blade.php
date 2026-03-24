@extends('mail.notification.custom_layout')

@section('content')    
    <p>
        {{ __('email.dear', ['name' => $name, 'surname' => $surname]) }} <br/><br/>
        {{ __('email.library_operator_invited', ['lib_name' => $lib_name]) }} <br/>
        {{ __('email.library_operator_permissions_list') }}
        @component('mail.notification.custom_permission_list', ['abilities' => $abilities])
        @endcomponent
    </p>

    <div class="buttonBlock">
        <a href="{{ $notification_url }}" class="button">
           {{ __('email.accept_deny_link') }}
        </a>
    </div>    
@endsection