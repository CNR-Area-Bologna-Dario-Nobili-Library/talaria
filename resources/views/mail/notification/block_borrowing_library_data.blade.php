@section('borrowing_library_data')
@isset($borrowing_library_name)
    <h3 class="library_data">@lang('globals.app.global.borrowing_library')</h3>          
    <b>@lang('globals.app.libraries.name'):</b>{{$borrowing_library_name}} <br/>
    @isset($borrowing_library_country)<b>@lang('globals.app.global.country'):</b> {{$borrowing_library_country}} <br/>@endisset
    @isset($borrowing_library_institution)<b>@lang('globals.app.libraries.institution_id'):</b> {{$borrowing_library_institution}} <br/>@endisset
    @isset($borrowing_library_address)<b>@lang('globals.app.global.address'):</b>{{$borrowing_library_address}}<br/>@endisset
    @isset($borrowing_library_town)<b>@lang('globals.app.global.town'):</b>{{$borrowing_library_town}} <br/>@endisset
    @isset($borrowing_library_district)<b>@lang('globals.app.global.district'):</b>{{$borrowing_library_district}} <br/>@endisset
    @isset($borrowing_library_postcode)<b>@lang('globals.app.global.postcode'):</b>{{$borrowing_library_postcode}} <br/>@endisset
    @isset($borrowing_library_state)<b>@lang('globals.app.global.state'):</b>{{$borrowing_library_state}} <br/>@endisset
    @isset($borrowing_library_ill_email)<b>@lang('globals.app.libraries.ill_email'):</b> {{$borrowing_library_ill_email}} <br/>@endisset
    @isset($borrowing_library_ill_phone)<b>@lang('globals.app.libraries.ill_phone'):</b> {{$borrowing_library_ill_phone}} <br/> @endisset
@endisset

@endsection
