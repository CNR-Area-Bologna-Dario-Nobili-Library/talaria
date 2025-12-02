@extends('mail.notification.custom_layout')

@section('content')    
    <p>
        Ciao!<br/> 
        
        Ricevi questa e-mail perchè abbiamo ricevuto una richiesta di reset della password per il tuo account. 
    </p>

    <div class="buttonBlock">
        <a href="{{ $notification_url }}" class="button">
            Clicca qui per resettare la password
        </a>
        <p>Il link è valido per {{$count}} minuti.</p>
    </div>    

    <p>Se non sei stato tu a richiedere il reset della password, non devi fare niente.</p>
@endsection