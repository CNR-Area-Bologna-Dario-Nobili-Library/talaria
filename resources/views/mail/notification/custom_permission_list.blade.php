@isset($abilities)
<div class="permissionsBlock">
    <ul>
    @foreach (explode (',',$abilities) as $perm)
        <li>@lang('globals.app.global.permissions.'.$perm)</li> 
    @endforeach
    </ul>
</div>
@endisset