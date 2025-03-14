/**
 *
 * SideBar
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from 'routes/messages';
import { Link, NavLink } from 'react-router-dom';
import './style.scss'

function SideBar(props) {
  console.log('SideBar', props)
  const isMobile = props.windowSize === 'mobile' ? true : false
  // const { auth, isLogged, history, headermenu } = props

  const current = props.routes && props.routes.filter((route)=>route.current)
  const routes = current && current.length ? current[0].children : [];
  
 /*NB: per le route con sidebar: true, posso definire anche order: che mi da la posizione nel menu laterale*/
  return routes && routes.length > 0 ? (
    <div className={`${isMobile ? 'sidebar' : 'sidebar-menu'}`}>
      <div className="scrollbar-container sidebar-nav ps ps-container">
        <nav>
          {routes.filter(item => item.sidebar)
          .sort(function (a, b) {
            if(a.order && b.order)
              return a.order - b.order;
            return 0;  
          })
          .map((route) => {
            //NOTE: we manage "children menu items" adding some margin-left using level_xx CSS classes
            return <NavLink
              className={`${route.level ? 'nav-link btn level_'+route.level : 'nav-link btn'}`}              
              key={route.name}
              exact
              to={`${route.url ? route.url : route.path}`}
              activeClassName="current"
            >
            {route.icon && 
              <i className={ route.icon.indexOf("icon-")==-1?`fa-solid fa-${route.icon}`: route.icon}></i>
            }
              <span><FormattedMessage {...messages[route.name]}/></span>
            </NavLink>
          }
          )}
        </nav>
      </div>
    </div>
  ) : null
}

SideBar.propTypes = {};

export default SideBar;
