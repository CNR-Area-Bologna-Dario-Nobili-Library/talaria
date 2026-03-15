@extends('mail.notification.custom_layout')
@include('mail.notification.block_library_data') 

@section('content')    
    <p>
    Yeni bir kütüphane kayıt olmayı talep etti. Lütfen yönetici paneline giderek talebi Kütüphaneler listesinden yönetin.
    </p>

    @yield('library_data')

    <div class="buttonBlock">
        <a href="{{ $notification_url }}" class="button">
           Yönetici paneline gitmek için tıklayınız
        </a>
    </div>    
@endsection