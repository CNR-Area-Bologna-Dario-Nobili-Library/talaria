<?php

use App\Helper\Helper;

$globalTrans=[
    'user_data_header'=>'Dati utente',    
    'reference_data_header'=>'Riferimento bibliografico',
    'request_data_header'=>'Dati richiesta',
    'delivery_data_header'=>'Punto di ritiro',
    'borrowing_library_data_header'=>'Biblioteca richiedente',
    'lending_library_data_header'=>'Biblioteca fornitrice',
    'request_link'=>'Clicca qui per aprire la richiesta',
    'users_list_link'=>'Clicca qui per aprire la lista utenti',
    'my_libraries_list_link'=>'Clicca qui per aprire la lista delle tue biblioteche',
];

//add translations from frontend
$globalTrans=array_merge($globalTrans,Helper::getTranslationFromJson('/application/frontend/app/translations/it.json'));

return $globalTrans;

?>