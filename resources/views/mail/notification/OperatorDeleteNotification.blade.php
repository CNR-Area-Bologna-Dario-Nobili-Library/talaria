@extends('mail.notification.custom_layout')

@section('content')    
    <p>
        {{ __('email.dear', ['name' => $name, 'surname' => $surname]) }} <br/><br/>
        {{ __('email.operator_removed', ['entity_name' => $entity_name]) }}
    </p>
@endsection