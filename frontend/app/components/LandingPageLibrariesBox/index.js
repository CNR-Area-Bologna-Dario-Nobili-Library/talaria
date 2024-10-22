import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'reactstrap';
import { useIntl } from 'react-intl';
import LandingPageBox from '../LandingPageBox';
import { Link } from 'react-router-dom';
import './style.scss';
import { permissionBadgeClass } from '../../utils/utilityFunctions.js';
import { formatDateTime } from '../../utils/dates';

const LandingPageLibrariesBox = props => {
  const { auth, title, history, canCollapse, collapsed } = props;
    
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
      canCollapse={canCollapse}
      collapsed={collapsed}
    >
      <>
        {/* Display the two tables first */}
        {auth.permissions.resources.libraries &&
          auth.permissions.resources.libraries.length >= 1 && (
            <div className="container">
              <h3 className="text-center mb-4">{intl.formatMessage({id:'app.components.LandingPageLibrariesBox.currentPermissionsList'})}</h3>
              <div className="div-responsive">
                <div className="div-table">
                  <div className="div-table-row">
                    <div className="div-table-header" style={{ width: '25%' }}>
                    {intl.formatMessage({id: 'app.global.library',})}
                    </div>
                    <div className="div-table-header" style={{ width: '42%' }}>
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
                      <div className="div-table-cell">{res.resource.name}</div>
                      <div className="div-table-cell">
                        {res.permissions.map((p, index) => (
                          <span
                            key={`badge_perm_${index}`}
                            className={`badge ${permissionBadgeClass(p)}`}
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                      <div className="div-table-cell d-flex justify-content-center align-items-center">
                        <div className="div-current-actions text-center">
                          <Link
                            className="btn btn-sm btn-primary mb-2"
                            to={'/library/' + res.resource.id}
                            key={'lib' + res.resource.id}
                          >
                            {intl.formatMessage({id:'app.global.go'})}
                          </Link>
                          {(res.permissions.includes('borrow') ||
                            res.permissions.includes('manage')) && (
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
                              {!fromOpenURLorPubmed && (
                                <Link
                                  className="btn btn-sm btn-info mb-2"
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
            </div>
          )}

        <br />
        <br />
        {auth.permissions.tempresources &&
          auth.permissions.tempresources.libraries &&
          auth.permissions.tempresources.libraries.filter(
            res => res.status === 0 || res.status === 2,
          ).length > 0 && (
            <div className="container">
              <h3 className="text-center mb-4">{intl.formatMessage({id:'app.components.LandingPageLibrariesBox.pendingPermissionsList'})}</h3>
              <div className="div-responsive">
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
                        <div className="div-table-cell">
                          {res.resource.name}
                        </div>
                        <div className="div-table-cell">
                          {res.permissions.map((p, index) => (
                            <span
                              key={`badge_temp_perm_${index}`}
                              className={`badge ${permissionBadgeClass(p)}`}
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                        <div className="div-table-cell">
                          <div
                            className={`status-point ${statusClass(
                              res.status,
                            )}`}
                          />
                        </div>
                        <div className="div-table-cell">
                          {formatDateTime(res.created_at)}
                        </div>
                        <div className="div-table-cell">
                          {formatDateTime(res.updated_at)}
                        </div>
                        <div className="div-table-cell">
                          {res.status == 0 && (                            
                            <div className="div-actions">
                              <a
                                className="btn btn-success btn-sm"
                                href="#"
                                onClick={() => props.onAccept(res.id)}
                              >
                                 <i class="fa-solid fa-check" title={intl.formatMessage({id: 'app.global.accept'})}></i>
                              </a>
                              <a
                                className="btn btn-danger btn-sm"
                                href="#"
                                onClick={() => props.onReject(res.id)}
                              >
                                 <i class="fa-solid fa-times" title={intl.formatMessage({id: 'app.global.reject'})}></i>
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

        {/* Add the hr separator */}
        <hr className="my-5" />

        {/* Are you a Librarian? section */}
        <div className="card mb-4">
          <div className="card-body">
            <div className="container text-center mt-5">
              <h1 className="card-body-header">
                {intl.formatMessage({id:'app.components.LandingPageLibrariesBox.areYouLibrarian'})}
              </h1>
              <p>{intl.formatMessage({id:'app.components.LandingPageLibrariesBox.findLibraryCommunity'})}</p>
              <div className="card-body-subheader">                                
                <div className="text-center text-center-custom">                  
                  <Link
                    className="btn btn-primary find-library-button"
                    to={'/find-library'}
                    aria-label={intl.formatMessage({id:"app.global.search"})}
                  >
                    {intl.formatMessage({id:"app.global.search"})}
                  </Link>
                </div>

              </div>
            </div>            
          </div>
        </div>
      </>
    </LandingPageBox>
  );
};

export default LandingPageLibrariesBox;
