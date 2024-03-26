import React, {useEffect,useState} from 'react';
import {Button} from 'reactstrap'
import {useIntl} from 'react-intl';
import messages from './messages';
import './style.scss';



const EditPermissionsForm = (props) => {
    const {data,submitCallback}=props
    
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
              <ul>
              {opPerms && Object.keys(opPerms).map(op => (                          
                  <li key={op}><input type="checkbox" onChange={()=>handleCheckbox(op,!opPerms[op])} name={op} checked={opPerms[op]}/> {op}</li>
                )
                )}                                          
              </ul>
              <Button color="info" onClick={() => submitCallback(opPerms)}>{intl.formatMessage({id: 'app.global.save'})}</Button>

            </div>                          
    )
}

export default EditPermissionsForm;
