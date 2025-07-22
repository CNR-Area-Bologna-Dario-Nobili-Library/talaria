@extends('mail.notification.custom_layout')

@section('content')    
    <p>
    Your library registration request has been approved. Please login and revise your library data, correct or update them in your Library/Profile menu. Now you can start to request documents from the other libraries
    </p>

    <p>
    <h3>Registration data</h3>

    <b>Library name:</b> {{$name}} <br/>
    <b>Address:</b> {{$address}}<br/>
    <b>DD/ILL Email:</b> {{$ill_email}}<br/>

    </p>

    <div class="buttonBlock">
        <a href="{{ $notification_url }}" class="button">
           Click here to go to dashboard
        </a>
    </div>    
@endsection