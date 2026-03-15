@extends('mail.notification.custom_layout')

@section('content')    
    <p>
    {{$name}} adlı kütüphane hesabı hatalı işlemler nedeniyle askıya alındı. 
    </p>
    
    <p class="contacts">@lang('notification.comm_manager_contacts')</p>
@endsection