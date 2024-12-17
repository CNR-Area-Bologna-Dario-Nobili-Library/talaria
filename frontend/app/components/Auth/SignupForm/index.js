/**
 *
 * SignupForm
 *
 */
import React, { Component, useEffect } from 'react';
import { Button, Card, CardBody, CardFooter, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row, Label, FormGroup } from 'reactstrap';
import { AppSwitch } from '@coreui/react'

import { withGoogleReCaptcha } from "react-google-recaptcha-v3"
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import globalMessages from 'utils/globalMessages'
import {withRouter,NavLink} from "react-router-dom";
import {formatDate} from 'utils/dates'
import {Loader, SocialAuth} from "../..";
import {ErrorBox} from 'components';
import {useIntl} from 'react-intl';

import './style.scss';

function SignupForm(props) {
  

  console.log("SignupForm",props)
  const [formData,setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
    privacy_policy_accepted: "",
    recaptcha: '',
  });
  const intl = useIntl();
  const [password, setPassword] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');
  const [validPassword, setvalidPassword] = React.useState(false);
  const [validrepeatPassword, setvalidrepeatPassword] = React.useState(false);
  const [formSubmitted, setformSubmitted] = React.useState(false);
  const [passwordrepeatError, setPasswordrepeatError] = React.useState('');

//  const passwordRegex = ^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[*~@#$%^&+=!()_{}><?:|\'\"\\])(?=\S+$).{8,}$;
  const passwordRegex = /^(?=.*?[A-Z])(?=(.*[a-z]))(?=(.*[\d]))(?=(.*[\W_]))(?!=.*\s).{8,}$/;
  
  // useEffect(() => {
  //
  //   props.googleReCaptchaProps.executeRecaptcha('Signup').then(token => {
  //     console.log(token)
  //   }).catch(error => {
  //     console.log("ERROR IN submitChange executeRecaptcha")
  //     console.error("error", error);
  //   });
  // })

  const validatePassword = (value) => {
    if (!passwordRegex.test(value)) {
      setPasswordError(intl.formatMessage({ id: 'app.global.password_pattern' }));
      setvalidPassword(false)
      return false;
    } else {
      setPasswordError('');
      setvalidPassword(true)
      return true;
    }
  }

  const handleChange = (e) =>{

    if (e.target.name === 'password') {
      const passwordLengthError = validatePassword(e.target.value)
        ? ''
        : intl.formatMessage({ id: 'app.global.password_pattern' });
      setPasswordError(passwordLengthError);
      setPassword(e.target.value);
    }

    if (e.target.name === 'password_confirmation') {
      const isPasswordMatchValid = e.target.value === password;
      const passwordError = !isPasswordMatchValid
        ? intl.formatMessage({ id: 'app.global.password_match' })
        : intl.formatMessage({ id: 'app.global.password_pattern' });
      setPasswordrepeatError(passwordError);
    
      if (!isPasswordMatchValid) {
        setvalidrepeatPassword(false)
        e.preventDefault();
      }
      else
       setvalidrepeatPassword(true)
    }
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handlePrivacyPolicty = (e) =>{
    //const value = e.target.checked ? formatDate(new Date) : ''
    var today = new Date();
    const value = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();

    setFormData({ ...formData,['privacy_policy_accepted']: value })
  }

  const submitChange = (e) =>{
    setformSubmitted(true)
    e.preventDefault();
    const form = e.target;
    form.classList.add('was-validated');
    if (form.checkValidity() === false) {
      console.log("Dont Send Form")
    } else {
      console.log('Sending Form Sign up')
      props.googleReCaptchaProps.executeRecaptcha('Signup').then(token => {
        props.signup({ ...formData, recaptcha: token })
      }).catch(error => {
        console.log("ERROR IN submitChange executeRecaptcha")
        console.error("error", error);
      });
    }
    return
  }

  return (        
      <Row className="justify-content-center">
          <Col md="9" lg="7" xl="6">
            <Card className="mx-4">
              <CardBody className="p-4">
                <Form onSubmit={submitChange}  noValidate>
                  <h1><FormattedMessage {...messages.subtitle} /></h1>
                  <p className="text-muted">
                    <FormattedMessage {...messages.subtitle} />
                  </p>
                  <InputGroup className="mb-3">
                    {/* <InputGroupAddon addonType="prepend">
                      <InputGroupText>name</InputGroupText>
                    </InputGroupAddon> */}
                    <Input
                      type="text"
                      placeholder={intl.formatMessage({ id: 'app.global.name' })}
                      autoComplete={intl.formatMessage({ id: 'app.global.name' })}
                      name="name"
                      value={formData.name}
                      onChange={(e) => handleChange(e)}
                      required
                    />
                    <ErrorBox className="invalid-feedback" error={  intl.formatMessage({ id: 'app.global.invalid_name' })} />
                  </InputGroup>
                  <InputGroup className="mb-3">
                   {/*  <InputGroupAddon addonType="prepend">
                      <InputGroupText>surname</InputGroupText>
                    </InputGroupAddon> */}
                    <Input
                      type="text"
                      placeholder={ intl.formatMessage({ id: 'app.global.surname' })}
                      autoComplete={ intl.formatMessage({ id: 'app.global.surname' })}
                      name="surname"
                      value={formData.surname}
                      onChange={(e) => handleChange(e)}
                      required
                    />
                    <ErrorBox className="invalid-feedback" error={  intl.formatMessage({ id: 'app.global.invalid_surname' })} />
                  </InputGroup>
                  <InputGroup className="mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>@</InputGroupText>
                    </InputGroupAddon>
                    <Input
                      type="email"
                      placeholder={  intl.formatMessage({ id: 'app.global.email' })}
                      autoComplete="email"
                      name="email"
                      value={formData.email}
                      onChange={(e) => handleChange(e)}
                      required
                    />
                    <ErrorBox className="invalid-feedback" error={  intl.formatMessage({ id: 'app.global.invalid_email' })} />
                  </InputGroup>
                  <InputGroup className="mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                      <i className="fa-solid fa-lock"></i>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      type="password"
                      placeholder={  intl.formatMessage({ id: 'app.global.password' })}
                      autoComplete="current-password"
                      name="password"
                      pattern="^(?=.*?[A-Z])(?=(.*[a-z]))(?=(.*[\d]))(?=(.*[\W_]))(?!=.*\s).{8,}$" 
                      value={formData.password}
                      onChange={(e) => handleChange(e)}
                      required
                    />
                    {formSubmitted && ( 
                      <ErrorBox
                        className="invalid-feedback"
                        error={intl.formatMessage({ id: 'app.global.password_pattern' })}
                      />
                    )}
                    {!validPassword && !formSubmitted && (
                      <div className="error-text">{passwordError}</div>
                    )}
                  </InputGroup>
                  <InputGroup className="mb-4">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                      <i className="fa-solid fa-lock"></i>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      type="password"
                      placeholder={ intl.formatMessage({ id: 'app.global.password_repeat' })}
                      autoComplete="password_confirmation"
                      name="password_confirmation"
                      value={formData.password_confirmation}
                      onChange={(e) => handleChange(e)}
                      pattern={`^${password.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`}
                      //pattern={`^${escapedRepeatPassword}$`}
                     required
                    />

                    {formSubmitted && (
                      <ErrorBox
                        className="invalid-feedback"
                        error={intl.formatMessage({ id: 'app.global.password_match' })}
                      />
                    )}

                    {!validrepeatPassword && !formSubmitted && (
                      <div className="error-text">{passwordrepeatError}</div>
                    )}
                  </InputGroup>
                  <InputGroup className="mb-4">
                    <AppSwitch className="mx-1" color="success"
                               value={formData.privacy_policy_accepted}
                               name='privacy_policy_accepted'
                               onChange={(e) => handlePrivacyPolicty(e)}
                               required
                               />
                    <Label check className="form-check-label" htmlFor="privacy_policy_accepted">Privacy policy</Label>
                    <ErrorBox className="invalid-feedback" error={  intl.formatMessage({ id: 'app.global.invalid_privacy_policy_accepted' })} />
                  </InputGroup>
                  <Button color="success" block>
                    <FormattedMessage {...messages.subtitle} />
                  </Button>                  
                </Form>              
              </CardBody>
              <NavLink to='/forgot-password' key='/forgot-password' className="text-dark-text text-center">
                              <FormattedMessage {...messages.forgot} />
                  </NavLink>
              {/* <CardFooter className="p-4">
                <SocialAuth loginFacebook={props.loginFacebook} loginGoogle={props.loginGoogle}/>
              </CardFooter> */}
            </Card>
          </Col>
        </Row>        
  );
}
SignupForm.propTypes = {};

export default withRouter(withGoogleReCaptcha((SignupForm)));

