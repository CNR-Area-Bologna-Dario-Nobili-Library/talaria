<?php

namespace App\Models\Requests;
use App\Models\BaseModel;
use App\Models\Libraries\Delivery;
use App\Models\Libraries\Library;
use App\Models\References\Reference;
use App\Models\Users\User;
use Carbon\Carbon;
use App\Resolvers\StatusResolver;

/*NOTA: la patronReq è necessaria
altrimenti non posso reinoltrare le richDD
in questo modo l'utente ne vede 1 ma la bib ne vede N
di cui, quelle che vengono reinoltrate hanno fw=1 e le altre hanno il parent
impostato in modo da poter risalire
alla principale (utile x history)
ovviam quella conclusiva e che evaderà/inevaderà a ute
sarà l'ultima che 
andrà anche ad aggiornare lo stato della patron dell'utente
Ovviamente quelle che hanno fw=1 vengono nascoste dall'interfaccia (xke' di fatto si sono concluse) ma sono visibili attraverso la history delle altre rich e ovviamente vengono contate come normali richieste
*/

/* NB: in questa classe non c'e' il user_id in quanto usiamo il campo created_by*/

//NOTA 5/8/2020: al momento non viene gestita l'accettazione della cancellaz richiesta da parte della biblio
//quindi l'utente richiede cancellazione e si ferma li (viene chiamata API e agg. lo stato con date)
class PatronDocdelRequest extends BaseModel
{
    protected $attributes = [
        'status' => 'requested',
    ];
    
    protected $fillable = [
        'borrowing_library_id', //id biblioteca alla quale ho inviato la rich.
        'reference_id',
        //'user_id', //usiamo create_by
        'librarycounter', //serve???  rm_countbib: ogni biblio si vede le rich utente partire da 1 usando questo campo
        //'status',  //status NON deve essere fillable perchè lo gestisco tramite StatusProvider
        'request_date',        
        'cancel_date', //data annullamento/cancellazione
        'fulfill_date', //data evasione/inevasione        
        'cost_policy', //Politica di Accettazione Costi: 0=Non accetta nessun costo; 1=Accetta qualunque costo; 2=Vuole essere informato
        'cost_policy_status', //1-accettatto,2-non accettato,3-non risp
        'waiting_cost_date', //data richieasta accettaz costo
        'answer_cost_date', //data accettaz/rifiuto costo
        'cost', //costo FN
        'forlibrary_note', //note ute->bib
        'fromlibrary_note', //note bib->ute
        'archived', //rich archiviata o no
        'delivery_id', //Punto di Consegna (scelto tra uno di quelli della Biblio)
        'delivery_format', //formato di invio da parte della biblio (es: 1-SEDD 2-PaperCopy, 3-FAX, 4-URL, 5-AE=URL 6-other... vedi ISO18626)        
        'delivery_ready_date', //data articolo disponibile al ritiro
        'notfulfill_type', //motivo inevasione (1=non reperibile, 2-ute non abili, 3=ute non ritira,4=ute rifiuta costo,5=ute non risponde al costo,6=non reperibile gratuitamente,7-rif errato)
        'url',
        'filename',
        'filehash',
        

        // DA VALUTARE
        //- Gestire stato "evaso via file all'utente" + permettere download file (se la lic lo consente)
        //  e prevedere la possibilità di accedere al pdf tramite visualizzatore PDF.js o altro inibendo download/print in base a licenza
        //  Ha senso prevedere un campo file? o basta una variabile evaso_via_file=true x consentire l'accesso al file?

        // filename  //lo mettiamo anche qui x file dato all'utente (se licenza lo consente)?
        //	rm_tempo_consegna_ut  	Tempo totale di consegna: rm_dataeva-rm_datarichie
        // 	rm_tempo_iniziolav 	 	Tempo per la presa in gestionde da parte della bib: dd_datarichie-rm_datarichie
        // 	rm_tempo_finelav        Tempo per la consegna del doc ricevuto da parte della bib: rm_dataeva-dd_dataeva

        
        
    ];

    protected static $observerClass=PatronDocdelRequestObserver::class;

    protected $simpleSearchFields=["pub_title"]; //ricerca sul riferimento

    protected $statusField="status";


    public function reference()
    {
        return $this->belongsTo(Reference::class)->withTrashed();
    }

    public function user()
    {
        return $this->owner();
    }

    public function docdelrequests()
    {
        return $this->hasMany(BorrowingDocdelRequest::class,'patron_docdel_request_id','id');
    }
    
    public function library()
    {
        return $this->belongsTo(Library::class,'borrowing_library_id');
    }
    
    public function libraryOperators() {
        $lib=$this->library;
        //get all borrowing/lending/.. operators
        return $lib->operators("borrow");

    }

    public function delivery()
    {
        return $this->belongsTo(Delivery::class,'delivery_id');
    }


    public function unfillToPatron() {     
        $this->changeStatus("notReceived"); 
    }

    public function fulfillToPatron() {
        $this->changeStatus("received"); 
    }


    public function scopeInReference($query, $reference_id)
    {
        return $query->where('reference_id', $reference_id);
    }

    public function scopeArchived($query, $archived)
    {
        return $query->where('archived','=',$archived);
    }

    public function scopeByLabel($query, $labelIds){
        return 
        $query->whereHas('reference', function ($q) use ($labelIds) {
            return $q->whereHas('labels', function($q2) use ($labelIds){
                $arr=explode(',',$labelIds);
                if(sizeof($arr)>0)
                    $q2->whereIn('labels.id', $arr);
            });    
        });
    }

    public function scopeByGroup($query, $groupIds){
        return 
        $query->whereHas('reference', function ($q) use ($groupIds) {
            return $q->whereHas('groups', function($q2) use ($groupIds){
                $arr=explode(',',$groupIds);
                if(sizeof($arr)>0)
                    $q2->whereIn('groups.id', $arr);
            });
        });
                    
    }

    //override del ModelTrait::scopeSimpleSearch
    //in modo da cercare sul riferimento!
    public function scopeSimpleSearch($query, $q)
    {
        $text = trim($q);
        return $query->whereHas('reference', function ($query2) use ($text) {
            $query2->where(function ($query) use ($text) {
                foreach ($this->simpleSearchFields as $field) {
                    $query->orWhere($field, 'like', '%' . $text . '%');
                }
            });
        });
    }

    public function changeStatus($newstatus,$others=[]) {
        $sr=new StatusResolver($this);                        

        switch ($newstatus)
        {
           // case 'userAskCancel': $others=['cancel_request_date'=>Carbon::now()]; break;
            
            case 'canceled': $others=array_merge($others,['cancel_date'=>Carbon::now(),'archived'=>1]); break;
            
            case "waitingForCost": $others=array_merge($others,['cost'=>$request->input("cost")]); break;
            
            case "costAccepted": 
            case "costNotAccepted": $others=array_merge($others,['answer_cost_date'=>Carbon::now()]); break;
            
            case "readyToDelivery": $others=array_merge($others,['delivery_ready_date'=>Carbon::now()]); break;
            
            case 'received': 
            case 'notReceived': $others=array_merge($others,['fulfill_date'=>Carbon::now()]); break;                
        }

        $sr->changeStatus($newstatus,$others);
        return $this;
    }


}
