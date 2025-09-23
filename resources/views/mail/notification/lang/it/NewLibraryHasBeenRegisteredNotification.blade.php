@extends('mail.notification.custom_layout')
@include('mail.notification.block_borrowing_library_data') 

@section('content')    
    <p>
    Una nuova biblioteca è stata registrata. Accedi all'interfaccia di admin per gestire la richiesta.
    </p>

   @yield('borrowing_library_data')

    <div class="buttonBlock">
        <a href="{{ $notification_url }}" class="button">
           Clicca qui per accedere alla dashboard di admin
        </a>
    </div>    
@endsection