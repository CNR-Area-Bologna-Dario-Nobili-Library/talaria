@extends('mail.notification.custom_layout')
@extends('mail.notification.custom_layout')
@include('mail.notification.block_library_user_data') 
@include('mail.notification.block_user_data') 

@section('content')    
    <p>
        A new patron has requested to join your library
    </p>

    <p>
    @yield('user_data')
    <br/><br/>
    @yield('library_user_data')

    </p>

    <div class="buttonBlock">
        <a href="{{ $notification_url }}" class="button">
             @lang('globals.users_list_link')
        </a>
    </div>    
@endsection