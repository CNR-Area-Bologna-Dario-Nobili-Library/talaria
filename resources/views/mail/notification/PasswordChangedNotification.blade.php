@extends('mail.notification.custom_layout')

@section('content')    
    <p>
        {{ __('email.hello') }} <br/>
        {{ __('email.password_changed') }}
    </p>

    <p>
        {{ __('email.password_changed_text') }}
    </p>
@endsection