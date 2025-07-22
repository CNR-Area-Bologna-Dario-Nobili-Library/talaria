{{-- Logo --}}
{{ config('app.name') }}
--

{{-- Header --}}
# {{$mail_subject}}

{{-- Content --}}
@yield('content')

{{-- Contacts --}}
@lang('notification.contacts')

{{-- Footer --}}
--
© {{ date('Y') }} {{ config('app.name') }}
