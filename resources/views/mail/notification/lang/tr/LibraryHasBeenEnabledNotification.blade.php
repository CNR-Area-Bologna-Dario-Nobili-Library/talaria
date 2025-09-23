@extends('mail.notification.custom_layout')
@include('mail.notification.block_borrowing_library_data') 

@section('content')    
    <p>
    Your library registration request has been approved. Please login and revise your library data, correct or update them in your Library/Profile menu. Now you can start to request documents from the other libraries
    </p>

    @yield('borrowing_library_data')

    <div class="buttonBlock">
        <a href="{{ $notification_url }}" class="button">
           Click here to go to dashboard
        </a>
    </div>    
@endsection