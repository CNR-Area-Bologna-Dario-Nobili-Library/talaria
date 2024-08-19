import React, {useEffect,useState} from 'react';
import {Button, Input} from 'reactstrap'
import {useIntl} from 'react-intl';
import messages from './messages';
import './style.scss';
import {translatePerm} from '../../../utils/utilityFunctions'



const LibraryEditPermissionsForm = (props) => {
    const {data,submitCallback,operatorData,history,filterPerm}=props

    console.log("LibraryEditPermissionsForm",props)
    
    const intl = useIntl()

    let initPerms={ 
      'borrow':false,     
      'lend': false,
      'deliver': false,
      'manage':false,    
      'manage-users':false,
      'manage-licenses': false
    }
    
      const [mounted,setMounted]=useState(false);

      const [saveDisabled,setSaveDisabled]=useState(true)

      const [opPerms,setOpPerms]=useState({...initPerms})  

      const resetPerms=() => {    
        setSaveDisabled(true);
        setOpPerms(filterPerm(initPerms))        
      }

      useEffect( ()=> {   
        setMounted(true)   
        resetPerms();
        data && data.forEach(perm=>{
            setOpPerms(opPerms => ({ 
                ...opPerms,
                [perm.name]: true,
              }));         
        })            
      },[data])

      useEffect( ()=> {   
        let count=0;
        opPerms && Object.keys(opPerms).forEach(p=>{
            if(opPerms[p])
              count++                          
        })
        if(count>0) setSaveDisabled(false);           
        else setSaveDisabled(true);  
      },[opPerms])


                
    
      const handleCheckbox = (op,val) => {
        if(op=="manage") {
          Object.keys(opPerms).forEach(p => {
            if(p!="manage")
              opPerms[p]=false;
          })
        }           

          setOpPerms({ 
            ...opPerms, 
            [op]: val,
          });
      }

      const submitForm=()=>{
        let permString=''
        Object.keys(opPerms).forEach(p=>{
         if(opPerms[p])
         {
          if(permString!="") permString=permString.concat(',');
          permString=permString.concat(p)
         }
        })             
        submitCallback(permString)

      }

    return (
         mounted && 
            <div className='editPermissionsForm'>                 
              <div className='card'>
                <div className="card-body">                    
                    <p className='intro'>Lorem Ipsum mollit aliqua occaecat incididunt et ut laboris reprehenderit incididunt veniam cupidatat veniam pariatur exercitation.</p>
                    {operatorData && <h5 className='card-title'>{operatorData.name} {operatorData.surname} ({operatorData.full_name}) {operatorData.email}</h5>}
                    <h4>{intl.formatMessage({id: 'app.global.permissions'})}</h4>
                    <ul>
                    {opPerms && Object.keys(opPerms).map(op => (                          
                        <li key={op}><input type="checkbox" onChange={()=>handleCheckbox(op,!opPerms[op])} name={op} checked={opPerms[op]} disabled={op!="manage" && opPerms["manage"]}/> {translatePerm(op)}</li>
                      )
                      )}                                          
                    </ul>
                    <Button disabled={saveDisabled} color="success" onClick={submitForm}>{intl.formatMessage({id: 'app.global.save'})}</Button>              
                    {history && <Button color="secondary" onClick={() => history.goBack() }>{intl.formatMessage({id: 'app.global.cancel'})}</Button> }                                        
                </div>
              </div>                            
          </div>                          
    )
}

export default LibraryEditPermissionsForm;
