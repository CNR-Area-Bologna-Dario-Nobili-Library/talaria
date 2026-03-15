@extends('mail.notification.custom_layout')
@include('mail.notification.block_library_data') 

@section('content')    
    <p>
    La richiesta di registrazione della tua biblioteca è stata approvata. Effettua il login e rivedi i dati, correggili o aggiornali nel menu "La mia biblioteca/Profilo biblioteca". Ora puoi iniziare a richiedere documenti alle altre biblioteche.
    </p>

    @yield('library_data')

    <div class="buttonBlock">
        <a href="{{ $notification_url }}" class="button">
        Clicca qui per accedere alla dashboard
        </a>
    </div>

    <p class="contacts">@lang('notification.comm_manager_contacts')</p>      
@endsection