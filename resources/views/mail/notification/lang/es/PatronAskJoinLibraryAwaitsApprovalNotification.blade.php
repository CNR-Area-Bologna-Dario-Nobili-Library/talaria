@extends('mail.notification.custom_layout')
@include('mail.notification.block_library_user_data') 
@include('mail.notification.block_library_data') 

@section('content')    
    <p>
        Tu solicitud de registro está pendiente de aprovación por parte de la biblioteca.
    </p>

    <p>
    @yield('library_data')
    <br/><br/>
    @yield('library_user_data')

    </p>

    <div class="buttonBlock">
        <a href="{{ $notification_url }}" class="button">
             @lang('globals.my_libraries_list_link')
        </a>
    </div>    
@endsection