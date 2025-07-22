@section('user_data')
    
    <h3 class="user_data">@lang('globals.user_data_header')</h3>     
    <b>@lang('globals.app.global.name'):</b> {{$user_name}} <br/>
    <b>@lang('globals.app.global.surname'):</b> {{$user_surname}}<br/>
    <b>@lang('globals.app.global.email'):</b> {{$user_email}}<br/>

@endsection