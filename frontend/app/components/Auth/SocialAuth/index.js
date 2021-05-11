import {Button, CardFooter, Col, Row} from "reactstrap";
import GarrImg from "../../../images/idem.svg";
import React from 'react';
import './style.scss'
import messages from './messages';
import { FormattedMessage } from 'react-intl';

export default function Index(props) {
  const social_enabled=(process.env.SOCIAL_LOGIN && process.env.SOCIAL_LOGIN=="true")?true:false;
  const institutional_login_enabled=(process.env.INSTITUTIONAL_LOGIN && process.env.INSTITUTIONAL_LOGIN=="true")?true:false;
  const spid_login_enabled=(process.env.SPID_LOGIN && process.env.SPID_LOGIN=="true")?true:false;


  return (
    <CardFooter className="p-4">
      <Row>
        {social_enabled && 
        <>
        <Col xs="12">
          <Button color="facebook" className="mb-1" block onClick={props.loginFacebook}><span>Facebook</span></Button>
        </Col>
        <Col xs="12">
          <Button color="google-plus" className="mb-1" block onClick={props.loginGoogle}><span>Google</span></Button>
        </Col>
        </>}
        {institutional_login_enabled &&         
        <Col xs="12">
          <a className="btn-garr-container" href="https://devnilde.bo.cnr.it/Shibboleth.sso/Login?target=https://devnilde.bo.cnr.it/shibb/shiblogin.php">
            <div className="btn-garr">
              <img src={GarrImg}/>
            </div>
            <div className="btn-garr-text">
            <FormattedMessage {...messages.garrButton} />
            </div>
          </a>
        </Col>  
        }      
        {spid_login_enabled &&   
        <Col xs="12">
            <div id="my-spid-button"> 
            {/* <div className="btn-garr-container">
              <div className="float-left btn-garr">
                <div id="my-spid-button">  
              </div>
            </div>
            <div className="btn-garr-text">
              Accedi con Spid
            </div> */}
            <noscript>
              Il login tramite SPID richiede che JavaScript sia abilitato nel browser
            </noscript>
          </div>
        </Col>}        
      </Row>
    </CardFooter>
  )
}
