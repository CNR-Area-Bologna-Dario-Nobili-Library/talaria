import React, {useEffect,useState} from 'react';
import {Button, Input} from 'reactstrap'
import {useIntl} from 'react-intl';
import messages from './messages';
import './style.scss';



const LibraryInviteOperatorForm = (props) => {
    const {submitCallback,userData,history}=props
    console.log("LibraryInviteOperatorForm",props)
    
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

      const [formData,setFormData]=useState({})

      const [saveDisabled,setSaveDisabled]=useState(true);

      const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
      }

      useEffect(() => {
        if (userData && Object.keys(userData).length > 0) {
          setFormData({ ...userData });
        } else {
          setFormData({});
        }
        }, [userData])
      
      
      useEffect( ()=> {   
        setSaveDisabled(true); 
        Object.keys(opPerms).forEach(p => {
          console.log("perm:",p+": "+opPerms[p])
          if(opPerms[p]) 
          {
            setSaveDisabled(false); 
            return;
          }
        });
      },[opPerms])
    
      const resetPerms=() => {    
        setOpPerms({
          ...initPerms
          }
        )
      }

      useEffect( ()=> {   
        setMounted(true)   
        resetPerms();  
        setFormData({})      
      },[])
    
      const handleCheckbox = (op,val) => {
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
        
        submitCallback({
          'user_name': formData.name,
          'user_surname': formData.surname,
          'user_id': formData.id,
          'user_email': formData.email,
          'abilities': permString
        }
        )

      }

    return (
         mounted && 
            <div className='editPermissionsForm'>                               
               <div className='card'>
                <div className="card-body">
                  <h5 className='card-title'>User</h5>
                  <Input
                    type="text"
                    placeholder="Name"
                    autoComplete="name"
                    readOnly={userData && userData.name!=null}
                    name="name"
                    value={formData.name || ''}
                    onChange={(e) => handleFormChange(e, 'name')}
                    required
                  />
                  <Input
                    type="text"
                    placeholder="Surname"
                    autoComplete="surname"
                    readOnly={userData && userData.surname!=null}
                    name="surname"
                    value={formData.surname || ''}
                    onChange={(e) => handleFormChange(e, 'surname')}
                    required
                  />                
                  <Input
                    type="text"
                    placeholder="Email"
                    autoComplete="email"
                    readOnly={userData && userData.email!=null}
                    name="email"
                    value={formData.email || ''}
                    onChange={(e) => handleFormChange(e, 'email')}
                    required
                  />
                </div>
              </div>

              <div className='card'>
                <div className="card-body">
                    <h5 className='card-title'>Permissions</h5>
                    <ul>
                    {opPerms && Object.keys(opPerms).map(op => (                          
                        <li key={op}><input type="checkbox" onChange={()=>handleCheckbox(op,!opPerms[op])} name={op} checked={opPerms[op]}/> {op}</li>
                      )
                      )}                                          
                    </ul>
                </div>
              </div>

                <Button disabled={saveDisabled} color="success" onClick={submitForm}>{intl.formatMessage({id: 'app.global.save'})}</Button>              
                {history && <Button color="secondary" onClick={() => history.goBack() }>{intl.formatMessage({id: 'app.global.cancel'})}</Button> }                            
          </div>                          
    )
}

export default LibraryInviteOperatorForm;
