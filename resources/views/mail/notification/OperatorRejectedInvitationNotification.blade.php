@extends('mail.notification.custom_layout')

@section('content')    
    <p>
        {{ __('email.operator_invitation_rejected', ['name' => $name, 'surname' => $surname]) }}
    </p> 
@endsection