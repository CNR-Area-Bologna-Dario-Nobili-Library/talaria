<?php
//NOTES:
//- status "name" must be less than 20 char lenght!
//- role/constraint are not defined, so averyone can call these statusChange
   //otherwise was too difficult to filter these methods
//- notify: you can specify which users has to be notified (will send notification) 
//          by default it will use  XXXNotification object (must exist App\Notifications\XXXNotification.php  (XXX is the classname of the current model) otherwise you can customize it (see below)
//  - Model: if it's a string, it wilk run the specified "method" of the current model, this method has to return users collection.
//           if it's an ARRAY [ [<methodname1>,"notificationClass1"],[<methodname2>,"notificationClass2"], ... ] it will send <notificationClass1> to the users collection obtained by running the specified <methodname1> and send <notificationClass2> to the users collection obtained by running the specified <methodname2> ... and so on ...
//  - User: will run the specified "method" of the User class. 
//NOTE: all the methods specified in "Model" or "User" MUST  return users collection (with props like user_id,email ... fields)
//- everytime you change this, please run: php artisan cache:clear + php artisan optimize 

return [
    'status_resolver' =>
        [
            'App\Models\Requests\PatronDocdelRequest'=> [

                'flow_tree' => [
                     //this configuration is needed by status resolver to exists because it checks when do status change FROM this state
                    //but it will not change TO this state is the default state when PDR is created, so we notify in the Observer
                    'requested'	=> [
                        'role'  =>  ['patron'],
                        'next_statuses'  =>  ['canceled','received','waitingForCost','notReceived','readyToDelivery'],
                        'constraints'   =>  ['isOwner'],
                    ],                   
                    'canceled'	=> [
                        'role'  =>  ['patron'],
                        'next_statuses'  =>  [],
                        'constraints'   =>  ['isOwner'],                     
                        'notify'    =>  [
                            'Model'=>[                                                                 
                                ['patronUser', 'DDILL\\PatronRequestHasBeenCanceledNotification']  //OK
                            ]
                        ],                           
                        'jobs' => ['App\\Jobs\\PatronUpdateBorrowing'] //update borrowing request and notify to borrow
                    ],
                    'waitingForCost' => [ //NOTE: possibile problema software "$request not defined" in PDR->changeStatus() line 205
                        'role'  =>  [], 
                        'next_statuses'  =>  ['costAccepted','costNotAccepted','costNotAnswered'],
                        'constraints'   =>  ['isOwner'],
                        'notify'    =>  [ //TODO
                            'Model'=>'owner',
                        ],
                        'jobs'=>[]
                    ],
                    'costAccepted' => [
                        'role'  =>  ['patron'],
                        'next_statuses'  =>  ['received','notReceived','readyToDelivery'],
                        'constraints'   =>  ['isOwner'],
                        'notify'    =>  [ //TODO
                            'Model'=>'owner',                           
                        ],
                        'jobs' => ['App\\Jobs\\PatronUpdateBorrowing']
                    ],
                    'costNotAccepted' => [//TODO
                        'role'  =>  ['patron'],
                        'next_statuses'  =>  ['notReceived'],
                        'constraints'   =>  ['isOwner'],
                        'notify'    =>  [
                            'Model'=>'owner',                            
                        ],
                        'jobs' => ['App\\Jobs\\PatronUpdateBorrowing']
                    ],
                    'costNotAnswered' => [//TODO
                        'role'  =>  [],
                        'next_statuses'  =>  ['costAccepted','notReceived'],
                        'constraints'   =>  ['isOwner'],
                        'notify'    =>  [
                            'Model'=>'owner',
                        ],
                        'jobs'=>[]
                    ],
                     //this configuration is needed by status resolver to exists because it checks when do status change FROM this state
                    //but it will not change TO this state cause is instead the borrower that change directly patrondocdelrequest status field without doing a pdr->changeStatus
                    //directly in the BorrowingDocdelrequest->changeStatus()
                    'readyToDelivery'	=> [
                        'role'  =>  [],
                        'next_statuses'  =>  ['received','notReceived'],
                        'constraints'   =>  ['isOwner'],         
                        'jobs'=>[]
                        /* NO NEED TO NOTIFY because already notified from borrowingrequest */
                        
                    ],
                    'received'	=> [
                        'role'  =>  [],
                        'next_statuses'  =>  [],
                       // 'constraints'   =>  ['isOwner'],
                        'notify'    =>  [
                            'Model'=>[                                 
                                ['patronUser', 'DDILL\\PatronRequestReceivedNotification'] //OK
                            ]
                        ],  
                        'jobs'=>[]
                        
                    ],
                    'notReceived'	=> [
                        'role'  =>  [],
                        'next_statuses'  =>  [],
                        //'constraints'   =>  ['isOwner'],
                       'notify'    =>  [
                            'Model'=>[                                 
                                ['patronUser', 'DDILL\\PatronRequestNotReceivedNotification'] //OK
                            ]
                        ],  
                        'jobs'=>[]
                       
                    ],   
                    /*'userAskCancel'	=> [
                        'role'  =>  ['patron'],
                        'next_statuses'  =>  ['Canceled','received','waitingForCost','notReceived','readyToDelivery'],
                        'constraints'   =>  ['isOwner'],
                    ],*/                
                ],
            ],
            'App\Models\Requests\BorrowingDocdelRequest'=> [
                'flow_tree' => [
                    //restart as new request
                    'newrequest'	=> [
                        'role'  =>  [],
                    'next_statuses'  =>  ['canceled','canceledDirect','requested','notDeliveredToUserDirect','notReceived','deliveredToUserDirect','deskReceived','deliveringToDesk'],
                        'constraints'   =>  [],                        
                        /*'notify'    =>  [
                            'Model'=>'borrowingLibraryBorrowingOperators',                            
                        ],*/  
                        //TODO: 'jobs'=>['App\\Jobs\\BorrowingRequestReset'] //clean all temp lender to start new request and update lender (if only 1) saying request was canceled
                    ],       
                        
                    'canceled'	=> [
                        'role'  =>  [],
                        'next_statuses'  =>  [],
                        'constraints'   =>  [],  
                        // NO NEED TO NOTIFY because already notified from lender
                    ],
                    //NOTE on canceledDirect: i removed constraint because this status can be changed both from patron or borrower                       
                    'canceledDirect'	=> [
                        'role'  =>  [],
                        'next_statuses'  =>  [],
                        'constraints'   =>  [],                            
                        'notify'    =>  [
                            'Model'=>[                                                                                                 
                                //NOTIFY to Borrower that patron request cancel direct (req goes to archive)
                                ['borrowingLibraryManageOperators', 'DDILL\\PatronAskToCancelRequestNotification'],   //OK
                                ['borrowingLibraryDeliverOperators', 'DDILL\\PatronAskToCancelRequestNotification'],  //OK
                                 /* NO NEED TO NOTIFY to lender because never requested to lender, and no need to notify to Patron because was already notified when PatronDDReq changed to cancel status */ 
                            ]
                        ],                      
                    ],
                    //NOTE on cancelRequested: i removed constraint because this status can be changed both from patron or borrower                                          
                    'cancelRequested'	=> [
                        'role'  =>  [],
                        'next_statuses'  =>  ['canceled'],
                        'constraints'   =>  [],  
                        'notify'    =>  [
                            'Model'=>[ 
                                ['borrowingLibraryManageOperators', 'DDILL\\PatronAskToCancelRequestNotification'],  //this will be sent also when borrow request cancelation too
                                ['borrowingLibraryDeliverOperators', 'DDILL\\PatronAskToCancelRequestNotification'], //this will be sent also when borrow request cancelation too                                
                                
                                //we CAST the BorrowingDocdelRequest to LendingDocdelRequest in order to send only "lending request fields" 
                                ['lendingLibraryManageOperators', 'DDILL\\CancelRequestedNotification'], //OK
                                ['lendingLibraryLendingOperators', 'DDILL\\CancelRequestedNotification'] //OK
                            ]
                        ],                          
                    ],
                    /*'canceledAccepted'	=> [
                        'role'  =>  [],//borrow/lend/manage?,
                        'next_statuses'  =>  ['canceled'],
                        'constraints'   =>  [],  
                        'notify'    =>  [
                            'Model'=>'borrowingLibraryBorrowingOperators',                            
                        ],                        
                    ],*/

                    //Note: i added also "canceled" next status, because from frontend 
                    //we need to change in "canceled" (from requested state) but we don't know what will be really the next status (cancelDirect,cancelRequested)
                    'requested'	=> [
                        'role'  =>  [],
                        'next_statuses'  =>  ['newrequest','canceled','canceledDirect','cancelRequested','fulfilled','notReceived'], 
                        'constraints'   =>  ["canBorrow"],  
                        'notify'    =>  [                           
                              'Model'=>[
                                ['lendingLibraryManageOperators', 'DDILL\\RequestReceivedNotification'], //OK
                                ['lendingLibraryLendingOperators', 'DDILL\\RequestReceivedNotification'] //OK
                             ],                                                
                        ],                          
                    ],
                    //this configuration is needed by status resolver to exists because it checks when do status change FROM this state
                    //but it will not change TO this state cause is instead the lender that change directly borrowing_status field without doing a borrow->changeStatus
                    'fulfilled'	=> [
                        'role'  =>  [],
                        'next_statuses'  =>  ['documentReady','documentNotReady'], 
                        'constraints'   =>  ["canBorrow"],                                                   
                    ],                    
                    'documentReady'	=> [ 
                        'role'  =>  [],
                        'next_statuses'  =>  ['deliveredToUser','notDeliveredToUser','deskReceived','deliveringToDesk'], 
                        'constraints'   =>  ["canBorrow"],  
                        /* NO NEED TO NOTIFY because we notify from Lending status change 
                        'notify'    =>  [
                            'Model'=>'borrowingLibraryBorrowingOperators',                                                        
                        ],                          
                        */
                    ],                    
                    'documentNotReady'	=> [ 
                        'role'  =>  [],
                        'next_statuses'  =>  ['notDeliveredToUser'], 
                        'constraints'   =>  ["canBorrow"],  
                        /* NO NEED TO NOTIFY because we notify from Lending status change 
                        'notify'    =>  [
                            'Model'=>'borrowingLibraryBorrowingOperators',                                                        
                        ],                          
                        */
                    ],
                    //this configuration is needed by status resolver to exists because it checks when do status change FROM this state
                    //and because it's used just in the case of a new request (but with parent) that must be set as notReceived+archived
                    //also the lender will change that directly without doing a borrow->changeStatus
                    'notReceived'	=> [ 
                        'role'  =>  [],
                        'next_statuses'  =>  ['notDeliveredToUser'], 
                        'constraints'   =>  ["canBorrow"],                                                   
                        /*'notify'    =>  [
                            'Model'=>'borrowingLibraryBorrowingOperators',                                                        
                        ],  
                        */
                    ],                    
                    'notDeliveredToUserDirect' => [
                        'role'  =>  [],
                        'next_statuses'  =>  [''], 
                        'constraints'   =>  ["canDeliver"],
                        'jobs' => ['App\\Jobs\\BorrowingUpdatePatronRequest'] //this will also notify to patron when changing PatronDocdelRequest status
                    ],
                    'notDeliveredToUser' => [
                        'role'  =>  [],
                        'next_statuses'  =>  [''], 
                        'constraints'   =>  ["canDeliver"],
                        'jobs' => ['App\\Jobs\\BorrowingUpdatePatronRequest'] //this will also notify to patron when changing PatronDocdelRequest status
                    ],
                    'deliveredToUser' => [
                        'role'  =>  [],
                        'next_statuses'  =>  [''], 
                        'constraints'   =>  ["canDeliver"],
                        'jobs' => ['App\\Jobs\\BorrowingUpdatePatronRequest'] //this will also notify to patron when changing PatronDocdelRequest status
                    ],
                    'deliveredToUserDirect' => [
                        'role'  =>  [],
                        'next_statuses'  =>  [''], 
                        'constraints'   =>  ["canDeliver"],
                        'jobs' => ['App\\Jobs\\BorrowingUpdatePatronRequest'] //this will also notify to patron when changing PatronDocdelRequest status
                    ],
                    //NB: added notDeliveredToUser+Direct cause it will change to these from deskNotReceived
                    'deliveringToDesk' => [
                        'role'  =>  [],
                        'next_statuses'  =>  ['deskReceived','deskNotReceived','notDeliveredToUser','notDeliveredToUserDirect'], 
                        'constraints'   =>  ["canBorrow"],
                        'notify'    =>  [
                            'Model'=> [ 
                                ['borrowingLibraryManageOperators', 'DDILL\\RequestDeliveringToDeskNotification'],  //OK
                                ['borrowingLibraryDeliverOperators', 'DDILL\\RequestDeliveringToDeskNotification'], //OK
                            ],                                                                  
                        ],                                 
                    ],
                    'deskReceived' => [
                        'role'  =>  [],
                        'next_statuses'  =>  ['deliveredToUser','notDeliveredToUser','deliveredToUserDirect','notDeliveredToUserDirect'], 
                        'constraints'   =>  ["canDeliver"],
                        'notify'    =>  [
                            'Model'=> [ 
                                ['borrowingLibraryManageOperators', 'DDILL\\RequestDeliveredToDeskNotification'],  //OK
                                ['borrowingLibraryDeliverOperators', 'DDILL\\RequestDeliveredToDeskNotification'], //OK
                                ['patronUser', 'DDILL\\PatronRequestDeskReceivedNotification'] //OK
                            ],   
                        ],                          
                    ],
                    /*questo è uno stato di transizione => va direttamente in notDeliveredToUserDirect o in notDeliveredToUser*/
                    'deskNotReceived' => [
                        'role'  =>  [],
                        'next_statuses'  =>  ['notDeliveredToUserDirect','notDeliveredToUser'], 
                        'constraints'   =>  ["canDeliver"],
                        /*'notify'    =>  [
                            'Model'=> [ 
                                ['borrowingLibraryManageOperators', 'DDILL\\RequestNotDeliveredToDeskNotification'],  //OK
                                ['borrowingLibraryDeliverOperators', 'DDILL\\RequestNotDeliveredToDeskNotification'], //OK
                                ['patronUser', 'DDILL\\PatronRequestDeskNotReceivedNotification'] //TODO o forse non serve?
                            ],                                                                                 
                        ],*/                     
                    ],                    
                ]
            ],
            'App\Models\Requests\LendingDocdelRequest'=> [
                'flow_tree' => [             
                    //this configuration is needed by status resolver to exists because it checks when do status change FROM this state
                    //but it will not change TO this state cause is instad the borrow that change directly lending_status field without doing a lending->changeStatus
                    'requestReceived' => [
                        'role' => [],
                        'next_statuses' => ['willSupply','canceledAccepted','unFilled'],
                        'constraints' => [],                         
                    ],
                    'willSupply' => [
                        'role' => [],//borrow/lend/manage?
                        'next_statuses' => ['copyCompleted','unFilled'],
                        'constraints' => [], 
                        'notify' => [
                            'Model'=>[ 
                                ['borrowingLibraryManageOperators', 'DDILL\\RequestWillSupplyNotification'], //OK
                                ['borrowingLibraryBorrowingOperators', 'DDILL\\RequestWillSupplyNotification'], //OK           
                            ]  
                        ],                         
                    ],
                    //this configuration is needed by status resolver to exists because it checks when do status change FROM this state
                    //but it will not change TO this state cause is instad the borrow that change directly lending_status field without doing a lending->changeStatus                    
                    'cancelRequested' => [
                        'role' => [],//borrow/lend/manage?
                        'next_statuses' => ['canceledAccepted','copyCompleted'],
                        'constraints' => [],                             
                        /* NO NEED TO NOTIFY because we notify from Borrowing status change */            
                    ],
                    'canceledAccepted' => [
                        'role' => [],//borrow/lend/manage?
                        'next_statuses' => [],
                        'constraints' => [], 
                        'notify' => [
                            'Model'=> [ 
                                ['borrowingLibraryManageOperators', 'DDILL\\CancelAcceptedNotification'],  //OK
                                ['borrowingLibraryBorrowingOperators', 'DDILL\\CancelAcceptedNotification'],  //OK
                            ],                     
                        ],                        
                    ],
                    'unFilled' => [
                        'role' => [],//borrow/lend/manage?
                        'next_statuses' => [],
                        'constraints' => [], 
                        'notify' => [
                            'Model'=>[ 
                                ['borrowingLibraryManageOperators', 'DDILL\\RequestUnfilledNotification'],    //OK
                                ['borrowingLibraryBorrowingOperators', 'DDILL\\RequestUnfilledNotification'], //OK
                            ]
                        ],                                               
                    ],
                    'copyCompleted' => [
                        'role' => [],//borrow/lend/manage?
                        'next_statuses' => [''],
                        'constraints' => [], 
                        'notify' => [
                            'Model'=>[
                                ['borrowingLibraryManageOperators', 'DDILL\\RequestCopyCompletedNotification'],  //OK
                                ['borrowingLibraryBorrowingOperators', 'DDILL\\RequestCopyCompletedNotification'], //OK  
                            ]
                        ],                         
                    ],
                           
                ],
            ],

            'App\Models\Libraries\Library'=> [ //NOTIFY: OK
                    'flow_tree' => [
                        //disabled
                        config("constants.library_status.disabled") => [
                            'role'  =>  ['super-admin','manager'],
                            'next_statuses'  =>  [config("constants.library_status.enabled"),config("constants.library_status.renewing")],                            
                            'notify' => [
                                'Model'=>['manageOperators', 'Library\\LibraryHasBeenDisabledNotification'], 
                            ], 
                        ],
                        config("constants.library_status.disabled_bad") => [
                            'role'  =>  ['super-admin','manager'],
                            'next_statuses'  =>  [config("constants.library_status.enabled")],
                            'notify' => [
                                'Model'=>['manageOperators', 'Library\\LibraryHasBeenDisabledBecauseBadBehaviourNotification'], 
                            ], 
                        ],
                        config("constants.library_status.disabled_subscription_expired") => [
                            'role'  =>  ['super-admin','manager'],
                            'next_statuses'  =>  [config("constants.library_status.disabled"),config("constants.library_status.renewing")],
                            'notify' => [
                                'Model'=>['manageOperators', 'Library\\LibraryHasBeenDisabledBecauseSubscriptionExpiredNotification'], 
                            ], 
                        ],
                        config("constants.library_status.disabled_didntpaid") => [
                            'role'  =>  ['super-admin','manager'],
                            'next_statuses'  =>  [config("constants.library_status.enabled")],
                            'notify' => [
                                'Model'=>['manageOperators', 'Library\\LibraryHasBeenDisabledBecauseDidntPaidNotification'], 
                            ], 
                        ],
                        //new
                        config("constants.library_status.new") => [
                            'role'  =>  ['super-admin','manager'],
                            'next_statuses'  =>  [config("constants.library_status.enabled"),config("constants.library_status.disabled")],                            
                        ],
                        //enabled
                        config("constants.library_status.enabled")	=> [
                            'role'  =>  ['super-admin','manager'],
                            'next_statuses'  =>  [config("constants.library_status.disabled"), config("constants.library_status.disabled_bad"), config("constants.library_status.disabled_didntpaid"),config("constants.library_status.renewing")],
                            'constraints'   =>  ["canBeEnabled"], 
                            'notify' => [
                                'Model'=>['manageOperators', 'Library\\LibraryHasBeenEnabledNotification'], 
                            ],                             
                        ],
                        //renewing
                        config("constants.library_status.renewing")=> [
                            'role'  =>  ['super-admin','manager'],
                            'next_statuses'  =>  [config("constants.library_status.enabled"),config("constants.library_status.disabled"),config("constants.library_status.disabled_subscription_expired")],
                            'notify' => [
                                'Model'=>['manageOperators', 'Library\\LibraryHasToRenewSubscriptionNotification'], 
                            ], 
                        ],
                ],
            
            ],  
            
            'App\Models\Institutions\Institution'=> [ //NOTIFY: TBD

                'flow_tree' => [
                    //disabled
                    config("constants.institution_status.disabled") => [
                        'role'  =>  ['super-admin','manager'],
                        'next_statuses'  =>  [config("constants.institution_status.enabled")],     
                        'constraints'   =>  ["canBeDisabled"],                         
                        /*'notify' => [
                            'Model'=>'manageOperators', 
                        ],*/ 
                    ],
                    config("constants.institution_status.enabled") => [
                        'role'  =>  ['super-admin','manager'],
                        'next_statuses'  =>  [config("constants.institution_status.disabled")],
                        /*'notify' => [
                            'Model'=>'manageOperators', 
                        ],*/ 
                    ],
                    config("constants.institution_status.pending") => [
                        'role'  =>  ['super-admin','manager'],
                        'next_statuses'  =>  [config("constants.institution_status.enabled")],
                        /*'notify' => [
                            'Model'=>'manageOperators', 
                        ],*/ 
                    ],
                ]
            ]
        ],
    ];