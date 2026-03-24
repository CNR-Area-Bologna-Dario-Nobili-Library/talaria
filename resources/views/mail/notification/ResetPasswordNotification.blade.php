@extends('mail.notification.custom_layout')

@section('content')    
    <p>
        {{ __('email.hello') }} <br/>
        
        {{ __('email.password_reset') }}
    </p>

    <div class="buttonBlock">
        <a href="{{ $notification_url }}" class="button">
        {{ __('email.password_reset_link') }}
        </a>
        <p class="text-muted">({{__('email.password_reset_expire', ['count' => $count])}})</p>
    </div>    

    <p>{{ __('email.password_reset_text') }}</p>
@endsection
