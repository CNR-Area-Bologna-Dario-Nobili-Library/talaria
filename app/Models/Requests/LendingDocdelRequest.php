<?php
//NOTA: solo i campi fillable vengono Salvati/inseriti dalle API
//quindi non c'e' problm, al max posso lavorare con i $visible per restituire via JSON
//solo i campi del Borrowi/Lending e non di tutta la tabella DocdelRequest

//NOTA: sembra che getAttributes() restituisca comunque tutti i campi della tabella!!
//=>occorre toglierli a mano???


namespace App\Models\Requests;
use App\Models\Libraries\Tag;
use Carbon\Carbon;
use Auth;
use App\Resolvers\StatusResolver;

class LendingDocdelRequest extends DocdelRequest
{

    private $lending_attributes=[
        'lending_notes', //dd_note_interne     
        'lending_protnr', //dd_nproteva        
        'lending_archived', //0|1 indica se la rich è archiviata
    ];

    protected $lending_guarded=[        
        'lending_status', //status req. lending        
        'lending_archived_date',
        'lending_operator_id',      
        'all_lender',          
    ];
     
    protected static $observerClass=LendingDocdelRequestObserver::class;

    protected $statusField="lending_status";
    protected $table = 'docdel_requests';    
       
    public function __construct()
    {
        parent::__construct();
        $this->guarded=array_merge($this->guarded,$this->lending_guarded);
        $this->fillable=array_merge($this->fillable,$this->lending_attributes);        
        $this->visible=array_merge($this->visible,$this->lending_attributes,$this->guarded);      
        //$this->visible=array_merge($this->visible,$this->fillable,$this->guarded); --- IGNORE ---
        //$this->visible=array_merge($this->visible,$this->fillable); --- IGNORE ---
    }



    public function tags()
    {
        //filter by libraryid (in case only on lending request for your library and not for all_lender)
        //TODO: try to return empty list when all_lender=1        
        //return $this->belongsToMany(Tag::class,"docdel_request_tag","docdel_request_id","tag_id")->inLibrary($this->lendinglibrary? $this->lendinglibrary()->first()->id:null);                                

        //NOTE: we have to filter by library id in order to display only tag of the lending library (or no tags for all_lender requests)        
        
        //if($this->lendinglibrary)
        //    return $this->belongsToMany(Tag::class,"docdel_request_tag","docdel_request_id","tag_id")->inLibrary($this->lendinglibrary()->first()->id);                                        
        

        //ATTENZIONE: questa fornisce anche i tag creati dal borrow, quindi bisogna filtrare x biblio =>
        //pero' restituendo dei tag che appartengono a una biblio diversa ritorna lista vuota
        //quindi forse bisogna fare una condizione diversa!
        //filter only lending tag
        return $this->belongsToMany(Tag::class,"docdel_request_tag","docdel_request_id","tag_id")->inLibrary($this->lendinglibrary? $this->lendinglibrary()->first()->id:null);                                
    }
    
    public function library()
    {
        return parent::lendinglibrary();
    }        

    
    public function operator()
    {        
        return $this->belongsTo('App\Models\Users\User', 'lending_operator_id');
    }


    public function canManage(User $user=null){
        $u = $user ? $user:Auth::user();        
        return 
            $u->can('manage', $this->lendinglibrary()->first())||            
            $u->can('lend', $this->lendinglibrary()->first());
    }


    public function changeStatus($newstatus,$others=[]) {
     
        $sr=new StatusResolver($this);                        
         switch ($newstatus)
         {  
            case 'willSupply':    
                $others=array_merge($others,[
                    'all_lender'=>0,
                    ]);                       
                break; 
      
            case 'unFilled': 
                $others=array_merge($others,[
                'borrowing_status'=>'notReceived',
                'lending_archived'=>1,
                'fulfill_date'=>Carbon::now(),
                ]);
                break;  

            case 'copyCompleted': 
                $bstatus='fulfilled';

                //Particular cases
                if($others["fulfill_type"]==1 && !env('USE_HARDCOPY',false) ) //File && HC disabled
                    $bstatus='documentReady';

                else if($others["fulfill_type"]==4) //URL
                    $bstatus='documentReady';

                $others=array_merge($others,[
                    'fulfill_date'=>Carbon::now(),
                    'borrowing_status'=>$bstatus,
                    'lending_archived'=>1                    
                ]);
                break;  
                
            case 'canceledAccepted': 
                  $others=array_merge($others,[
                      'cancel_date'=>Carbon::now(),
                      'borrowing_status'=>"canceled",
                      'lending_archived'=>1
                  ]);
                break;
                
         }
 
         $sr->changeStatus($newstatus,$others);

         return $this;
    }

    public function scopeNotRequestedBy($query, $library_id)
    {        
        return $query->where('borrowing_library_id', '<>',$library_id);
    }

    public function scopeInLibrary($query, $library_id)
    {        
        return $query->where('lending_library_id', $library_id);
    }  
    
    public function scopeLendingarchived($query, $lending_archived)
    {
        if ($lending_archived>0)
            return $query->where('lending_archived','=',$lending_archived);
        else
            return $query->where('lending_archived','=',null);
    }

    public function scopeLendingalllender($query, $all_lender)
    {
        return $query->where('all_lender','=',$all_lender)
        ->where("lending_status",'=','requestReceived');       
    }
   
    public function scopeByTags($query, $tagIds){
        return $query->whereHas('tags', function($q) use ($tagIds){
            $arr=explode(',',$tagIds);
            if(sizeof($arr)>0)
                return $q->whereIn('tags.id', $arr);
            return;    
        });        
    }
     
}