@section('delivery_data')
    @isset($delivery_id)
        <h3 class="delivery_data">@lang('globals.delivery_data_header')</h3>     
        <b>@lang('globals.app.global.name'):</b> {{$delivery_name}} <br/>
        @isset($delivery_country)<b>@lang('globals.app.global.country'):</b> {{$delivery_country}} <br/>@endisset
        @isset($delivery_address)<b>@lang('globals.app.global.address'):</b>{{$delivery_address}}<br/>@endisset
        @isset($delivery_town)<b>@lang('globals.app.global.town'):</b>{{$delivery_town}} <br/>@endisset
        @isset($delivery_district)<b>@lang('globals.app.global.district'):</b>{{$delivery_district}} <br/>@endisset
        @isset($delivery_email)<b>@lang('globals.app.libraries.ill_email'):</b> {{$delivery_email}} <br/>@endisset
        @isset($delivery_phone)<b>@lang('globals.app.libraries.ill_phone'):</b> {{$delivery_phone}} <br/> @endisset
    @endisset
@endsection