@extends('mail.notification.custom_layout')

@section('content')    
    <p>
        Merhaba! <br/> 
        
        Bu e-postayı aldınız çünkü hesabınız için bir şifre yenileme talebi aldık.
    </p>

    <div class="buttonBlock">
        <a href="{{ $notification_url }}" class="button">
        Şifrenizi yenilemek için buraya tıklayınız
        </a>
        <p class="text-muted">(Şifre yenileme linki {{$count}} dakika sonra geçersiz olacak)</p>
    </div>    

    <p>Eğer şifre yenileme talep etmediyseniz, işlem yapmanıza gerek yok.</p>
@endsection
