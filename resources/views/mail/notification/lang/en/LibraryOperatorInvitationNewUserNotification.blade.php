@extends('mail.notification.custom_layout')

@section('content')    
    <p>
        Dear {{$name}} {{$surname}},<br/><br/>
        the library {{$lib_name}} has invited you as operator<br/>
        Your permissions are: 
        @component('mail.notification.custom_permission_list', ['abilities' => $abilities])
        @endcomponent

        It seems that you do not have an account on the system. You have to sign up first!
    </p>

    <div class="buttonBlock">
        <a href="{{ $notification_url }}" class="button">
           Click here to signup
        </a>
    </div>    
@endsection