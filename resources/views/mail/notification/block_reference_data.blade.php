@section('reference')
    @isset($reference_pub_title)
        <h3 class="reference_data">@lang('globals.reference_data_header')</h3>
        <b>
            @switch($reference_material_type) 
                @case(1) @lang('globals.app.references.article') @break
                @case(2) @lang('globals.app.references.book') @break
                @case(3) @lang('globals.app.references.thesis') @break
                @case(4) @lang('globals.app.references.cartography') @break
                @case(5) @lang('globals.app.references.manuscript') @break
            @endswitch
        </b>: 
        {{$reference_pub_title}} 
    @endisset 
    @if ($reference_material_type==1) <span>, <i>{{$reference_part_title}}</i></span> @endif
    <br/>        
    @isset($reference_authors)
        @if ($reference_material_type != 1)  
            <b>@lang('globals.app.references.authors')</b>: {{$reference_authors}} 
        @endif 
    @endisset 
    @isset($reference_part_authors)
        @if ($reference_material_type === 1 || $reference_material_type === 2)  
            @if ($reference_material_type === 1) 
                <b>@lang('globals.app.references.authors')</b>:{{$reference_part_authors}}  
            @else 
                <b>@lang('globals.app.references.part_authors')</b>:{{$reference_part_authors}} 
            @endif             
        @endif 
    @endisset 
    <br/>                     
    <b>@lang('globals.app.references.pubyear')</b>: {{ $reference_pubyear}}        
@endsection