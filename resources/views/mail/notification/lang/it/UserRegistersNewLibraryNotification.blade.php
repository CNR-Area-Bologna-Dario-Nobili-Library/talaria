@extends('mail.notification.custom_layout')
@include('mail.notification.block_library_data') 

@section('content')    
    <p>
    La biblioteca è stata registrata con successo, ma è necessario attendere l'attivazione da parte del community manager.
    </p>

    @yield('library_data')

    <div class="buttonBlock">
        <a href="{{ $notification_url }}" class="button">
           Clicca qui per accedere alla dashboard
        </a>
    </div>    
@endsection