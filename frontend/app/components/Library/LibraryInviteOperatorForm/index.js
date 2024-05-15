import React, { useEffect, useState } from 'react';
import { Button, Input, FormFeedback, FormGroup, Label } from 'reactstrap';
import { useIntl } from 'react-intl';
import messages from './messages';
import './style.scss';

const LibraryInviteOperatorForm = props => {
  const { submitCallback, userData, history } = props;
  console.log('LibraryInviteOperatorForm', props);

  const intl = useIntl();

  let initPerms = {
    borrow: false,
    lend: false,
    deliver: false,
    manage: false,
    'manage-users': false,
    'manage-licenses': false,
  };

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
      setEmailValid(true); // Reset email validity when new user data is loaded
    } else {
      setFormData({});
      setEmailValid(true); // Reset email validity when form is reset
    }
  }, [userData]);

  useEffect(() => {
    let isFormValid = true;

    if (!Object.values(opPerms).some(perm => perm)) {
      //console.log("perm:",p+": "+opPerms[p])
      isFormValid = false;
    }
    if (!formData.name || !formData.surname || !formData.email || !emailValid) {
      isFormValid = false;
    }

    setSaveDisabled(!isFormValid);
  }, [opPerms, formData, emailValid]);

  const resetPerms = () => {
    setOpPerms({
      ...initPerms,
    });
  };

  useEffect(() => {
    setMounted(true);
    resetPerms();
    setFormData({});
    setEmailValid(true); // Reset email validity when component loadss
  }, []);

  const handleCheckbox = (op, val) => {
    if (op == 'manage') {
      Object.keys(opPerms).forEach(p => {
        if (p !== 'manage') opPerms[p] = false;
      });
    }
    setOpPerms({
      ...opPerms,
      [op]: val,
    });
  };

  const submitForm = () => {
    let permString = '';
    Object.keys(opPerms).forEach(p => {
      if (opPerms[p]) {
        if (permString !== '') permString = permString.concat(',');
        permString = permString.concat(p);
      }
    });

    submitCallback({
      user_name: formData.name,
      user_surname: formData.surname,
      user_id: formData.id,
      user_email: formData.email,
      abilities: permString,
    });
    //props.onInviteSuccess(); // Notify parent to clear input
  };

  return (
    mounted && (
      <div className="editPermissionsForm">
        <div className="card">
          <div className="card-body">
            {/* <h5 className='card-title'>User</h5> */}
            <FormGroup>
              <Label for="name">
                Name <span className="text-danger">*</span>
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
                Surname <span className="text-danger">*</span>
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
                Email <span className="text-danger">*</span>
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
              {!emailValid && <FormFeedback>Email is not valid</FormFeedback>}
            </FormGroup>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Permissions</h5>
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
                    {op}
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
