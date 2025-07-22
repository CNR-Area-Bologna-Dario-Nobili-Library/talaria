@extends('mail.notification.custom_layout')

@section('content')    
    <p>
    Library has been registered but you've to wait Community Manager activation
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