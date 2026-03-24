@extends('mail.notification.custom_layout')

@section('content')    
    <p>
    {{ __('email.request_canceled', ['id' => $id]) }}
    </p>    
@endsection