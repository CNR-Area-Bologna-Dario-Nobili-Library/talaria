@section('library_user_data')
        
@isset($department) <b>@lang('globals.app.global.department'):</b>{{$department}} <br/>@endisset
@isset($title)<b>@lang('globals.app.global.title'):</b>{{$title}} <br/>@endisset
@isset($user_referent)<b>@lang('globals.app.containers.LibraryUserPage.user_referent'):</b>{{$user_referent}} <br/>@endisset
@isset($user_mat)<b>@lang('globals.app.containers.LibraryUserPage.user_mat'):</b>{{$user_mat}} <br/>@endisset

@endsection