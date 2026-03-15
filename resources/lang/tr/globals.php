<?php

use App\Helper\Helper;

$globalTrans=[
    'user_data_header'=>'Kullanıcı detayları',    
    'reference_data_header'=>'Referans detayları',
    'request_data_header'=>'Talep detayları',
    'delivery_data_header'=>'Yayının teslim alınacağı noktanın detayları',
    'borrowing_library_data_header'=>'Talep eden kütüphane',
    'lending_library_data_header'=>'Sağlayıcı kütüphane',
    'request_link'=>'Talebi yönetmek için buraya tıklayınız',
    'users_list_link'=>'Kullanıcı listesini açmak için buraya tıklayınız',
    'my_libraries_list_link'=>'Kütüphane listenizi açmak için buraya tıklayınız',
];

//add translations from frontend
$globalTrans=array_merge($globalTrans,Helper::getTranslationFromJson('/application/frontend/app/translations/tr.json'));

return $globalTrans;

?>