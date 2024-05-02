import React, {useEffect,useState} from 'react';
import {Button, Input} from 'reactstrap'
import {useIntl} from 'react-intl';
import messages from './messages';
import './style.scss';



const LibraryEditPermissionsForm = (props) => {
    const {data,submitCallback,operatorData,history}=props

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

      const [opPerms,setOpPerms]=useState({...initPerms})  

      const resetPerms=() => {    
        setOpPerms({
          ...initPerms
          }
        )
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
                    {operatorData && <h5 className='card-title'>{operatorData.name} {operatorData.surname} ({operatorData.full_name}) {operatorData.email}</h5>}
                    <ul>
                    {opPerms && Object.keys(opPerms).map(op => (                          
                        <li key={op}><input type="checkbox" onChange={()=>handleCheckbox(op,!opPerms[op])} name={op} checked={opPerms[op]} disabled={op!="manage" && opPerms["manage"]}/> {op}</li>
                      )
                      )}                                          
                    </ul>
                    <Button color="success" onClick={submitForm}>{intl.formatMessage({id: 'app.global.save'})}</Button>              
                    {history && <Button color="secondary" onClick={() => history.goBack() }>{intl.formatMessage({id: 'app.global.cancel'})}</Button> }                                        
                </div>
              </div>                            
          </div>                          
    )
}

export default LibraryEditPermissionsForm;
