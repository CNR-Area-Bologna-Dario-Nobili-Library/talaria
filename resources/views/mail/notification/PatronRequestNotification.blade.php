@extends('mail.notification.custom_layout')
@include('mail.notification.block_patron_request_data') 

@section('content')                              
    @yield('patron_request')
    @yield('request_link')
@endsection

