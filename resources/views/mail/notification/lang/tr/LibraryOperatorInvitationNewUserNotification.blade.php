@extends('mail.notification.custom_layout')

@section('content')    
    <p>
        Sayın {{$name}} {{$surname}},<br/><br/> 
        {{$lib_name}} adlı kütüphane sizi operatör olarak davet etti. <br/>
        İzinleriniz:
        @component('mail.notification.custom_permission_list', ['abilities' => $abilities])
        @endcomponent

        Sistemde hesabınız yok gibi görünüyor. Önce kayıt olmalısınız!
    </p>

    <div class="buttonBlock">
        <a href="{{ $notification_url }}" class="button">
           Buraya tıklayarak kayıt olun
        </a>
    </div>    
@endsection