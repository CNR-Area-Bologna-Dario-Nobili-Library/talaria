@extends('mail.notification.custom_layout')

@section('content')    
    <p>
    {{ __('email.library_renew_subscription', ['name' => $name]) }}
    </p>    
@endsection