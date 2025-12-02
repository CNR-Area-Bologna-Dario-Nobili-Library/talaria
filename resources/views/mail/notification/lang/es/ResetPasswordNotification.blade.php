@extends('mail.notification.custom_layout')

@section('content')    
    <p> 
        Hello!<br/> 
        
        You are receiving this email because we received a password reset request for your account. 
    </p>

    <div class="buttonBlock">
        <a href="{{ $notification_url }}" class="button">
        Click here to reset your password
        </a>
        <p class="text-muted">(This password reset link will expire in {{$count}} minutes)</p>
    </div>    

    <p>If you did not request a password reset, no further action is required.</p>
@endsection
