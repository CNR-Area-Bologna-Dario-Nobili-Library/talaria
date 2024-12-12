import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'reactstrap';
import { useIntl } from 'react-intl';
import LandingPageBox from '../LandingPageBox';
import { Link } from 'react-router-dom';
import './style.scss';
import { permissionBadgeClass,libraryStatusIcon } from '../../utils/utilityFunctions.js';
import { formatDateTime } from '../../utils/dates';

const LandingPageLibrariesBox = props => {
  const { auth, title, intro,history, canCollapse, collapsed } = props;
    
  const intl = useIntl();
  
  const fromOpenURLorPubmed =
    history &&
    history.location &&
    history.location.search.includes('byopenurl');

   

  
  const statusClass = status => {
    switch (status) {
      case 0:
        return 'pending';
      case 2:
        return 'disabled';
      default:
        return status;
    }
  };

  return (
    <LandingPageBox
      iconClass="fa-solid fa-landmark"
      title={title}
      intro={intro}
      canCollapse={canCollapse}
      collapsed={collapsed}
    >
      <>
        {/* Display the two tables first */}
        {auth.permissions.resources.libraries &&
          auth.permissions.resources.libraries.length >= 1 && (
            <div className="container mb-5">
              <h3 className="text-center mb-4">{intl.formatMessage({id:'app.components.LandingPageLibrariesBox.currentPermissionsList'})}</h3>              
                <div className="div-table">
                  <div className="div-table-row">
                    <div className="div-table-header" style={{ width: '33%' }}>
                    {intl.formatMessage({id: 'app.global.library',})}
                    </div>
                    <div className="div-table-header" style={{ width: '8%' }}>
                    {intl.formatMessage({id: 'app.global.status',})}
                    </div>
                    <div className="div-table-header" style={{ width: '25%' }}>
                    {intl.formatMessage({id: 'app.global.permissions',})}
                    </div>                    
                    <div
                      className="div-table-header"
                      style={{ width: '33%', textAlign: 'center' }}
                    >
                     {intl.formatMessage({id: 'app.global.actions',})}
                    </div>
                  </div>
                  {auth.permissions.resources.libraries.map((res, i) => (
                    <div className="div-table-row" key={`row-${i}`}>
                      <div className="div-table-cell" style={{ width: '33%' }}>{res.resource.name}</div>
                      <div className="div-table-header" style={{ width: '8%' }}>
                      {libraryStatusIcon(res.resource.status)}
                      </div>
                      <div className="div-table-cell" style={{ width: '25%' }}>
                        {res.permissions.map((p, index) => (
                          <span
                            key={`badge_perm_${index}`}
                            className={`badge ${permissionBadgeClass(p)}`}
                          >
                            {p}
                          </span>
                        ))}
                      </div>                      
                      <div className="div-table-cell justify-content-center align-items-center" style={{ width: '33%', textAlign: 'center' }}>
                        <div className="div-actions text-center">
                          <Link
                            className="btn btn-sm btn-primary mb-2"
                            to={'/library/' + res.resource.id}
                            key={'lib' + res.resource.id}
                          >
                            {intl.formatMessage({id:'app.global.go'})}
                          </Link>
                          {((res.permissions.includes('borrow') ||
                            res.permissions.includes('manage')) && res.resource.status==1  ) && (
                            <>
                              {fromOpenURLorPubmed && (
                                <Link
                                  className="btn btn-sm btn-success mb-2"
                                  to={
                                    '/library/' +
                                    res.resource.id +
                                    '/borrowing/new' +
                                    (history.location.search
                                      ? history.location.search
                                      : '')
                                  }
                                  key={'openurllink' + res.resource.id}
                                >
                                  {intl.formatMessage({id:'app.components.LandingPageLibrariesBox.importFromOpenurlButton'})}
                                </Link>
                              )}
                              {(
                                <Link
                                  className="btn btn-sm btn-success mb-2"
                                  to={
                                    '/library/' +
                                    res.resource.id +
                                    '/borrowing/new'
                                  }
                                  key={'borrlink' + res.resource.id}
                                >
                                  {intl.formatMessage({id:'app.components.LandingPageLibrariesBox.newRequestButton'})}
                                </Link>
                              )}                              
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>            
          )}

        {auth.permissions.tempresources &&
          auth.permissions.tempresources.libraries &&
          auth.permissions.tempresources.libraries.filter(
            res => res.status === 0 || res.status === 2,
          ).length > 0 && (
            <div className="container mb-5">
              <h3 className="text-center mb-4">{intl.formatMessage({id:'app.components.LandingPageLibrariesBox.pendingPermissionsList'})}</h3>              
                <div className="div-table">
                  <div className="div-table-row">
                    <div className="div-table-header" style={{ width: '25%' }}>
                    {intl.formatMessage({id: 'app.global.library',})}
                    </div>
                    <div className="div-table-header" style={{ width: '19%' }}>
                    {intl.formatMessage({id: 'app.global.permissions',})}
                    </div>
                    <div className="div-table-header" style={{ width: '10%' }}>
                    {intl.formatMessage({id: 'app.global.status',})}
                    </div>
                    <div className="div-table-header" style={{ width: '13%' }}>
                    {intl.formatMessage({id: 'app.global.created_at',})}
                    </div>
                    <div className="div-table-header" style={{ width: '13%' }}>
                    {intl.formatMessage({id: 'app.global.updated_at',})}
                    </div>
                    <div className="div-table-header" style={{ width: '20%' }}>
                      {intl.formatMessage({id: 'app.global.actions',})}

                    </div>
                  </div>
                  {auth.permissions.tempresources.libraries
                    .filter(res => res.status === 0 || res.status === 2) // Filter the libraries with status 0 or status 2
                    .map((res, i) => (
                      <div className="div-table-row" key={`pendrow-${i}`}>
                        <div className="div-table-cell" style={{ width: '25%' }}>
                          {res.resource.name}
                        </div>
                        <div className="div-table-cell" style={{ width: '19%' }}>
                          {res.permissions.map((p, index) => (
                            <span
                              key={`badge_temp_perm_${index}`}
                              className={`badge ${permissionBadgeClass(p)}`}
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                        <div className="div-table-cell" style={{ width: '10%' }}>
                          <div
                            className={`status-point ${statusClass(
                              res.status,
                            )}`}
                          />
                        </div>
                        <div className="div-table-cell" style={{ width: '13%' }}>
                          {formatDateTime(res.created_at)}
                        </div>
                        <div className="div-table-cell" style={{ width: '13%' }}>
                          {formatDateTime(res.updated_at)}
                        </div>
                        <div className="div-table-cell" style={{ width: '20%' }}>
                          {res.status == 0 && (                            
                            <div className="div-actions">
                              <a
                                className="btn btn-success btn-sm"
                                href="#"
                                onClick={() => props.onAccept(res.id)}
                              >
                                 <i className="fa-solid fa-check" title={intl.formatMessage({id: 'app.global.accept'})}></i>
                              </a>
                              <a
                                className="btn btn-danger btn-sm"
                                href="#"
                                onClick={() => props.onReject(res.id)}
                              >
                                 <i className="fa-solid fa-times" title={intl.formatMessage({id: 'app.global.reject'})}></i>
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>            
          )}
        
        {/* Want register new library? */}
        <div className='container mb-5'>
          <h3 className="text-center mb-4">
                {intl.formatMessage({id:'app.components.LandingPageLibrariesBox.findLibraryCommunity'})}
          </h3>              
          <div className="text-center">                  
              <Link
                      className="btn btn-primary"
                      to={'/find-library'}
                      aria-label={intl.formatMessage({id:"app.components.FindLibrary.registerButton"})}
                    >
                      {intl.formatMessage({id:"app.components.FindLibrary.registerButton"})}
              </Link>
          </div>
        </div>
      </>      
    </LandingPageBox>
  );
};

export default LandingPageLibrariesBox;
