import React, {useEffect,useState} from 'react';
import {Button} from 'reactstrap'
import {useIntl} from 'react-intl';
import messages from './messages';
import './style.scss';



const LibraryEditPermissionsForm = (props) => {
    const {data,submitCallback,operatorData,history}=props
    
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
        data.forEach(perm=>{
            setOpPerms(opPerms => ({ 
                ...opPerms,
                [perm.name]: true,
              }));         
        })            
      },[data])
    
      const handleCheckbox = (op,val) => {
        setOpPerms({ 
          ...opPerms, 
          [op]: val,
        });
      }

    return (
         mounted && 
            <div className='editPermissionsForm'>                 
              <h3>{operatorData.name} {operatorData.surname} ({operatorData.full_name}) {operatorData.email}</h3>
              <ul>
              {opPerms && Object.keys(opPerms).map(op => (                          
                  <li key={op}><input type="checkbox" onChange={()=>handleCheckbox(op,!opPerms[op])} name={op} checked={opPerms[op]}/> {op}</li>
                )
                )}                                          
              </ul>
              <Button color="success" onClick={() => submitCallback(opPerms)}>{intl.formatMessage({id: 'app.global.save'})}</Button>              
              <Button color="secondary" onClick={() => history.goBack() }>{intl.formatMessage({id: 'app.global.cancel'})}</Button> 

            </div>                          
    )
}

export default LibraryEditPermissionsForm;
