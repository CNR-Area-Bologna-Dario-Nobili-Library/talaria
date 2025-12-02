@extends('mail.notification.custom_layout')
@include('mail.notification.block_request_data') 

@section('content')                              
    @yield('request')
    @yield('request_link')
@endsection

