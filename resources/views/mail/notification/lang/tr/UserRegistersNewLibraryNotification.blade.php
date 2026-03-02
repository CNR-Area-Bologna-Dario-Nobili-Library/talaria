@extends('mail.notification.custom_layout')
@include('mail.notification.block_library_data') 

@section('content')    
    <p>
    Kütüphaneniz başarıyla kaydedildi, sistem yöneticisinin hesabınızı aktive etmesini bekleyiniz.
    </p>

    @yield('library_data')

    <div class="buttonBlock">
        <a href="{{ $notification_url }}" class="button">
           Kullanıcı paneline gitmek için buraya tıklayın
        </a>
    </div>    
@endsection