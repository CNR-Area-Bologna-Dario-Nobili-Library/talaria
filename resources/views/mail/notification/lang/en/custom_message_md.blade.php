@extends('mail.notification.custom_layout_md')
{{-- Content --}}
@section('content')
Welcome {{$name}} {{$email}}
Thanks for joining our community!
    @component('mail::button', ['url' => $url ])
        Click here to login
    @endcomponent

@endsection
     