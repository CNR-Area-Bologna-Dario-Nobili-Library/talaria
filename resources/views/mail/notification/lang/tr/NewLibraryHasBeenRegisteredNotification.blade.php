@extends('mail.notification.custom_layout')

@section('content')    
    <p>
    A new library has requested registration. Please go in the admin dashboard libraries list and manage the request.
    </p>

    <p>
    <h3>Registration data</h3>

    <b>Library name:</b> {{$name}} <br/>
    <b>Address:</b> {{$address}}<br/>
    <b>DD/ILL Email:</b> {{$ill_email}}<br/>

    </p>

    <div class="buttonBlock">
        <a href="{{ $notification_url }}" class="button">
           Click here to go to admin dashboard
        </a>
    </div>    
@endsection