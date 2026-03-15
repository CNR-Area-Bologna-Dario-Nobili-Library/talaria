<?php

use App\Helper\Helper;

$globalTrans=[
    'user_data_header'=>'Datos del usuario',    
    'reference_data_header'=>'Datos del documento',
    'request_data_header'=>'Datos de la petición',
    'delivery_data_header'=>'Información sobre el punto de recogida',
    'borrowing_library_data_header'=>'Biblioteca solicitante',
    'lending_library_data_header'=>'Biblioteca suministradora',
    'request_link'=>'Clicar aquí para gestionar la petición',
    'users_list_link'=>'Clicar aquí para abrir la lista de usuarios',
    'my_libraries_list_link'=>'Clicar aquí para abrir tu lista de bibliotecas',
];

//add translations from frontend
$globalTrans=array_merge($globalTrans,Helper::getTranslationFromJson('/application/frontend/app/translations/es.json'));

return $globalTrans;

?>