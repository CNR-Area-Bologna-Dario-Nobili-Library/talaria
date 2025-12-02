@extends('mail.notification.custom_layout')
@include('mail.notification.block_library_user_data') 
@include('mail.notification.block_borrowing_library_data') 

@section('content')    
    <p>
        Your registration request is awaiting for approval by the librarians
    </p>

    <p>
    @yield('borrowing_library_data')
    <br/><br/>
    @yield('library_user_data')

    </p>

    <div class="buttonBlock">
        <a href="{{ $notification_url }}" class="button">
             @lang('globals.my_libraries_list_link')
        </a>
    </div>    
@endsection