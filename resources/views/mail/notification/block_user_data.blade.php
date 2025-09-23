@section('user_data')
@isset($user_name)    
    <h3 class="user_data">@lang('globals.user_data_header')</h3>     
    <b>@lang('globals.app.global.name'):</b> {{$user_name}} <br/>
    @isset($user_surname)<b>@lang('globals.app.global.surname'):</b> {{$user_surname}}<br/>@endisset
    @isset($user_email)<b>@lang('globals.app.global.email'):</b> {{$user_email}}<br/>@endisset
@endisset
@endsection