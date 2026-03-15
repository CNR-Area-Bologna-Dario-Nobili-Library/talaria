@extends('mail.notification.custom_layout')
@include('mail.notification.block_library_data') 

@section('content')    
    <p>
    Kütüphane kayıt talebiniz onaylandı. Lütfen giriş yapın ve kütüphane bilgilerinizi gözden geçirin, Kütüphane/Profil menüsünde varsa düzeltmeleri yapın veya hesabınızı güncelleyiniz. Yayın talep etmeye başlayabilirsiniz.
    </p>

    @yield('library_data')

    <div class="buttonBlock">
        <a href="{{ $notification_url }}" class="button">
           Kullanıcı paneline gitmek için tıklayınız
        </a>
    </div>    
@endsection