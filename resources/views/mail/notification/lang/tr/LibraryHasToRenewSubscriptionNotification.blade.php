@extends('mail.notification.custom_layout')

@section('content')    
    <p>
    {{$name}} adlı kütüphanenin üyeliğinin yenilenmesi gerekiyor.
    </p>
    
    <p class="contacts">@lang('notification.comm_manager_contacts')</p>
@endsection