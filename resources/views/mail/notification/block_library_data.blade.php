@section('library_data')

<h3 class="library_data">@lang('globals.app.global.library')</h3>          
<b>@lang('globals.app.libraries.name'):</b>{{$library_name}} <br/>
@isset($library_country)<b>@lang('globals.app.global.country'):</b> {{$library_country}} <br/>@endisset
@isset($library_institution)<b>@lang('globals.app.libraries.institution_id'):</b> {{$library_institution}} <br/>@endisset
@isset($library_address)<b>@lang('globals.app.global.address'):</b>{{$library_address}}<br/>@endisset
@isset($library_town)<b>@lang('globals.app.global.town'):</b>{{$library_town}} <br/>@endisset
@isset($library_district)<b>@lang('globals.app.global.district'):</b>{{$library_district}} <br/>@endisset
@isset($library_ill_email)<b>@lang('globals.app.libraries.ill_email'):</b> {{$library_ill_email}} <br/>@endisset
@isset($library_ill_phone)<b>@lang('globals.app.libraries.ill_phone'):</b> {{$library_ill_phone}} <br/> @endisset

@endsection