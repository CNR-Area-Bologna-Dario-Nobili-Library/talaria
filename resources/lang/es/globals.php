<?php

use App\Helper\Helper;

$globalTrans=[
    'user_data_header'=>'???User detail',    
    'reference_data_header'=>'???Reference detail',
    'request_data_header'=>'???Request detail',
    'delivery_data_header'=>'???Pickup point detail',
    'borrowing_library_data_header'=>'???Borrowing library',
    'lending_library_data_header'=>'???Lending library',
    'request_link'=>'???Click here to open the request',
    'users_list_link'=>'???Click here to open users list',
    'my_libraries_list_link'=>'???Click here to open your libraries list',
];

//add translations from frontend
$globalTrans=array_merge($globalTrans,Helper::getTranslationFromJson('/application/frontend/app/translations/es.json'));

return $globalTrans;

?>