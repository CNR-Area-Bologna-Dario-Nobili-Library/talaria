/**
 *
 * Footer
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import logo from 'images/logo.png';
import poweredBy from 'images/powered_by_talaria.png';
import './style.scss';
import {useIntl} from 'react-intl';


function Footer(props) {
  const {changeLang}=props

  const intl=useIntl();

  return (
    <footer className="app-footer">
      <div className="container">
        <div className="top">  
          <div className="footer-menu">          
            <>
              <a href="https://l.cnr.it/talaria-software-manual" target="_blank">
                 {intl.formatMessage({id: 'app.global.software_manual'})}
              </a>
              <NavLink to="#" activeClassName="current">
              {intl.formatMessage({id: 'app.global.contacts'})}
              </NavLink>              
            </>          
          {!props.isLogged && 
            <>              
            </>
          }
          </div>
        </div>
        <div className="footer-logos bottom align-items-end">
          <a href="" target="_blank"><img className='mh-100' src={logo} alt="logo" /></a>                    
          <span className="poweredby float-right"><a href="https://github.com/tugn0x/Talaria" target="_blank"><img className='' src={poweredBy} alt="Powered By Talaria" /></a></span>
        </div>
      </div>
    </footer>
  );
}

Footer.propTypes = {};

export default Footer;
