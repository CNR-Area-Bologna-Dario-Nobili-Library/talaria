@section('lending_library_data')
@isset($lending_library_name)
    <h3 class="library_data">@lang('globals.app.global.library')</h3>          
    <b>@lang('globals.app.libraries.name'):</b>{{$lending_library_name}} <br/>
    @isset($lending_library_country)<b>@lang('globals.app.global.country'):</b> {{$lending_library_country}} <br/>@endisset
    @isset($lending_library_institution)<b>@lang('globals.app.libraries.institution_id'):</b> {{$lending_library_institution}} <br/>@endisset
    @isset($lending_library_address)<b>@lang('globals.app.global.address'):</b>{{$lending_library_address}}<br/>@endisset
    @isset($lending_library_town)<b>@lang('globals.app.global.town'):</b>{{$lending_library_town}} <br/>@endisset
    @isset($lending_library_district)<b>@lang('globals.app.global.district'):</b>{{$lending_library_district}} <br/>@endisset
    @isset($lending_library_postcode)<b>@lang('globals.app.global.postcode'):</b>{{$lending_library_postcode}} <br/>@endisset
    @isset($lending_library_state)<b>@lang('globals.app.global.state'):</b>{{$lending_library_state}} <br/>@endisset
    @isset($lending_library_ill_email)<b>@lang('globals.app.libraries.ill_email'):</b> {{$lending_library_ill_email}} <br/>@endisset
    @isset($lending_library_ill_phone)<b>@lang('globals.app.libraries.ill_phone'):</b> {{$lending_library_ill_phone}} <br/> @endisset
@endisset
@endsection