import React, { useEffect, useState } from 'react';
import { Button, Input, FormFeedback, FormGroup, Label } from 'reactstrap';
import { useIntl } from 'react-intl';
import messages from './messages';
import './style.scss';
import {toast} from 'react-toastify'
import {translatePerm} from '../../../utils/utilityFunctions'

const LibraryInviteOperatorForm = props => {
  const { submitCallback, userData, history,auth,filterPerm } = props;
  console.log('LibraryInviteOperatorForm', props);

  const patrons_enabled=(process.env.MANAGE_PATRONS && process.env.MANAGE_PATRONS=="true")?true:false;

  const intl = useIntl();

  let initPerms = {
    borrow: false,
    lend: false,    
    manage: false,        
   /*
   NOT IMPLEMENTED     
    'manage-licenses': false,
    */
  };

  //add "delivery" and "manage-users" options only if patrons are enabled
  if (patrons_enabled) 
    initPerms={...initPerms,deliver: false,'manage-users': false,}

  const [mounted, setMounted] = useState(false);
  const [opPerms, setOpPerms] = useState({ ...initPerms });
  const [formData, setFormData] = useState({});
  const [saveDisabled, setSaveDisabled] = useState(true);
  const [emailValid, setEmailValid] = useState(true);

  const handleFormChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (e.target.name === 'email') {
      validateEmail(e.target.value);
    }
  };

  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailValid(emailRegex.test(email));
  };

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
          //console.log("perm:",p+": "+opPerms[p])
          if(opPerms[p]) 
          {
            setSaveDisabled(false); 
            return;
          }
        });
      },[opPerms])
    
      const resetPerms=() => {    
        setOpPerms(filterPerm(initPerms))
      }

      useEffect( ()=> {   
        setMounted(true)   
        resetPerms();  
        setFormData({})      
      },[])
    
      //if manager has been selected, reset all other permissions (because a manager can do any operations)
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
      if (auth.user.email==formData.email) 
      {
        setEmailValid(false);
        toast.error(intl.formatMessage({id:'app.components.LibraryInviteOperatorForm.cannotInviteYourselfMessage'}));
      }
      else {
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

      }

  return (
    mounted && (
      <div className="editPermissionsForm">      
        <div className="card">
          <div className="card-body">
            {/* <h5 className='card-title'>User</h5> */}
            <FormGroup>
              <Label for="name">
              {intl.formatMessage({id: 'app.global.name'})} <span className="text-danger">*</span>
              </Label>
              <Input
                type="text"
                id="name"
                placeholder="Name"
                autoComplete="name"
                readOnly={userData && userData.name != null}
                name="name"
                value={formData.name || ''}
                onChange={e => handleFormChange(e)}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="surname">
              {intl.formatMessage({id: 'app.global.surname'})} <span className="text-danger">*</span>
              </Label>
              <Input
                type="text"
                id="surname"
                placeholder="Surname"
                autoComplete="surname"
                readOnly={userData && userData.surname != null}
                name="surname"
                value={formData.surname || ''}
                onChange={e => handleFormChange(e)}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="email">
              {intl.formatMessage({id: 'app.global.email'})} <span className="text-danger">*</span>
              </Label>
              <Input
                type="email"
                id="email"
                placeholder="Email"
                autoComplete="email"
                readOnly={userData && userData.email != null}
                name="email"
                value={formData.email || ''}
                onChange={e => handleFormChange(e)}
                invalid={!emailValid}
                required
              />
              {!emailValid && <FormFeedback>{intl.formatMessage({id: 'app.global.invalid_email'})}</FormFeedback>}
            </FormGroup>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h5 className="card-title">{intl.formatMessage({id: 'app.global.permissions'})}</h5>
            <ul>
              {opPerms &&
                Object.keys(opPerms).map(op => (
                  <li key={op}>
                    <input
                      type="checkbox"
                      onChange={() => handleCheckbox(op, !opPerms[op])}
                      name={op}
                      checked={opPerms[op]}
                      disabled={op !== 'manage' && opPerms['manage']}
                    />{' '}
                    {translatePerm(op)}
                  </li>
                ))}
            </ul>
          </div>
        </div>

        <Button disabled={saveDisabled} color="success" onClick={submitForm}>
          {intl.formatMessage({ id: 'app.global.save' })}
        </Button>
        {history && (
          <Button color="secondary" onClick={() => history.goBack()}>
            {intl.formatMessage({ id: 'app.global.cancel' })}
          </Button>
        )}
      </div>
    )
  );
};

export default LibraryInviteOperatorForm;
