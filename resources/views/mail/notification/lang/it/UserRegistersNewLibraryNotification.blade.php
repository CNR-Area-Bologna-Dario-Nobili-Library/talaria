@extends('mail.notification.custom_layout')
@include('mail.notification.block_borrowing_library_data') 

@section('content')    
    <p>
    La biblioteca è stata registrata ma devi attendere l'attivazione da parte del Community Manager
    </p>

    @yield('borrowing_library_data')

    <div class="buttonBlock">
        <a href="{{ $notification_url }}" class="button">
           Clicca qui per accedere alla dashboard
        </a>
    </div>    
@endsection