/**
 *
 * HeaderBar
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';
import { Link, NavLink } from 'react-router-dom';
import { DropdownItem, DropdownMenu, DropdownToggle, Nav, UncontrolledDropdown, Badge, NavItem } from 'reactstrap';
import SubHeaderBar from 'components/SubHeaderBar'
import { AppAsideToggler, AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import logo from 'images/logo-nilde.png'
import logomini from 'images/logo.png'
import './style.scss'
import ResourceMenu from "./ResourcesMenu";
import subStringer from 'utils/subStringer'
import {checkRole} from 'utils/permissions'
import Notification from '../Notification'
import {Col, Row} from 'reactstrap';
import ResourceHeaderBar from '../ResourceHeaderBar';

function HeaderBar(props) {

  console.log('HeaderBar', props)

  // console.log('HeaderBar', props)

  const { auth, isLogged, history, headermenu, routes, isMobile,match } = props

  const currentRoute = routes && routes.filter(route => route.current).length > 0 ? routes.filter(route => route.current) : null;

  /* const linkTo = (path) => {
    history.push(`${path}`)
  }; */

  const isCurrentPage = (pagePath) => {
    /*
    TODO: IMPROVE REGEX!
    */
    return pagePath === props.location.pathname || new RegExp(`^\/${pagePath.replace("/", "\/")}(.*?)`).test(props.location.pathname);
  };


  return (

    <>
      <header className="app-header navbar bg-grey-white px-4">
      <div className="container">
        <div className="header-container row">
          <div className="header-left-col">            
            { isLogged && headermenu && isMobile &&
              currentRoute && currentRoute[0].children.length > 0 &&
              <AppSidebarToggler display="xs">
                <span></span>
                <span></span>
                <span></span>
              </AppSidebarToggler>
            }            
            <AppNavbarBrand
              full={{ src: logo, alt: 'Nilde Logo' }}
              minimized={{ src: logomini, width: 30, height: 30, alt: 'Nilde Logo' }}
              href={'/'}
              className="col-md-7"
            />
          </div>          
          <div className="header-right-col">
            <Nav className="account-nav" navbar>
              {
                !isLogged && (<NavItem>
                  <Link to="/login" className="nav-link">Login</Link>
                </NavItem>)
              }
              <UncontrolledDropdown nav direction="down">
                <DropdownToggle nav>
                  { isLogged && (
                      <>
                        <i className="fas fa-2x fa-user d-table-cell"></i>
                        <span className="user-name d-none d-md-table-cell align-middle px-3">
                          {subStringer(auth.user.name, 10)}
                        </span>
                        <i className="fas fa-2x fa-sort-down d-table-cell align-middle"></i>
                      </>
                    )
                  }
                </DropdownToggle>
                <DropdownMenu right>
                  {
                    isLogged && (
                      <>
                      {checkRole(auth, "super-admin") && (
                        <div className="resources-menu">
                          <Row className="head item">
                              <i className={`fas fa-cog`}></i>
                              <span><FormattedMessage {...messages.admin} /></span>
                          </Row>
                          <Row className="item">
                              <NavLink to={`/admin`} activeClassName="current">
                                Nilde Admin
                              </NavLink>    
                          </Row>
                        </div>
                      )}
                      {
                        checkRole(auth, "patron") && (
                        <div className="resources-menu">
                          <Row className="head item">
                              <i className={`fas fa-book-reader`}></i>
                              <span><FormattedMessage {...messages.patron} /></span>
                          </Row>
                          <Row className="item">
                              <NavLink to={`/patron/references`} activeClassName="current">
                                Patron main page 
                              </NavLink>    
                          </Row>
                        </div>)
                      }
                        {
                          auth.permissions.resources && (<ResourceMenu resources={auth.permissions.resources} />)
                        }
                      <div className="account">
                        {/*<DropdownItem header tag="div" className="text-center">
                          <FormattedMessage {...messages.UserAccount} />
                        </DropdownItem>
                        <DropdownItem onClick={() => linkTo("/patron/my-libraries")}><i className="fas fa-user"></i><span>Patron</span></DropdownItem>*/}
                          <Row className="head item">
                              <i className="fas fa-user"></i>
                              <span><FormattedMessage {...messages.Profile} /></span> 
                          </Row>
                          <Row className="item">
                            <NavLink to="/user/user-profile" activeClassName="current">
                              <span><FormattedMessage {...messages.Profile} /></span>  
                            </NavLink>
                          </Row>
                          <Row className="item">
                            <NavLink to="/user/change-password" activeClassName="current">
                              <span><FormattedMessage {...messages.ChangePassword} /></span>
                            </NavLink>
                          </Row>
                          <Row className="item">
                            <NavLink to="#" onClick={e => props.logout(e)} activeClassName="current">
                                <span><FormattedMessage {...messages.Logout} /></span>
                            </NavLink>  
                          </Row>
                        </div>
                      </>
                    )
                  }

                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
            {isLogged && <Notification /> }
          </div>
          </div>
        </div>
      </header>
      {auth.permissions.resources && <ResourceHeaderBar auth={auth} match={match}/>}
      { headermenu && <SubHeaderBar routes={routes} auth={auth}/> }
    </>
  );
}

HeaderBar.propTypes = {};

export default HeaderBar;
