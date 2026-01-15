@extends('mail.notification.custom_layout')
@include('mail.notification.block_borrowing_library_data') 

@section('content')    
    <p>
    Una nuova biblioteca ha richiesto la registrazione. Accedi alla dashboard di amministrazione e gestisci la richiesta dall'elenco delle biblioteche.
    </p>

   @yield('borrowing_library_data')

    <div class="buttonBlock">
        <a href="{{ $notification_url }}" class="button">
           Clicca qui per accedere alla dashboard di amministrazione
        </a>
    </div>    
@endsection