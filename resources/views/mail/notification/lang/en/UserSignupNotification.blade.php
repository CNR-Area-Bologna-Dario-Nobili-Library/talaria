@extends('mail.notification.custom_layout')

@section('content')    
    <p>
        Welcome {{$name}} {{$surname}} in our  community!
    </p>

    <p>
    <h3>Registration data</h3>

    <b>Name:</b> {{$name}} <br/>
    <b>Surname:</b> {{$surname}}<br/>
    <b>Email:</b> {{$email}}<br/>

    </p>

    <div class="buttonBlock">
        <a href="{{ $notification_url }}" class="button">
           Click here to login
        </a>
    </div>    
@endsection