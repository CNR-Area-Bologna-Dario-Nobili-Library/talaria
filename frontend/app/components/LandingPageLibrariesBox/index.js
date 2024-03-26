import React from 'react';
import { Button } from 'reactstrap';
import './style.scss';
import LandingPageBox from '../LandingPageBox';
import { Link } from 'react-router-dom';
import { formatDateTime } from '../../utils/dates';
import {permissionBadgeClass} from '../../utils/utilityFunctions.js'

const LandingPageLibrariesBox = (props) => {
  const {auth,title,match,history,canCollapse,collapsed}=props

  const fromOpenURLorPubmed =
    history &&
    history.location &&
    history.location.search.includes('byopenurl');

  console.log('LandingPageLibrariesBox', props);

  const statusClass = status => {
    switch (status) {
      case 0:
        return 'pending';
        break;
      // case 1: return 'success'; break;
      case 2:
        return 'disabled';
        break;
    }
    return status;
  };

  return (
    <LandingPageBox
      iconClass="fa-solid fa-landmark"
      title={title}
      canCollapse={canCollapse}
      collapsed={collapsed}
    >
      <>
        {auth.permissions.resources.libraries &&
          auth.permissions.resources.libraries.length >= 1 && (
            <div className="container">
              <h3 className="text-center mb-4">Current Permissions</h3>
              <div className="div-responsive">
                <div className="div-table">
                  <div className="div-table-row">
                    <div className="div-table-header" style={{ width: '25%' }}>
                      Library
                    </div>
                    <div className="div-table-header" style={{ width: '42%' }}>
                      Permissions
                    </div>
                    <div
                      className="div-table-header"
                      style={{ width: '33%', textAlign: 'center' }}
                    >
                      Actions
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
                          >
                            Visit This Library
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
                                  Import from Openurl/Pubmed
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
                                  New request
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
              <h3 className="text-center mb-4">Pending/Rejected Requests</h3>
              <div className="div-responsive">
                <div className="div-table">
                  <div className="div-table-row">
                    <div className="div-table-header" style={{ width: '25%' }}>
                      Library
                    </div>
                    <div className="div-table-header" style={{ width: '19%' }}>
                      Permissions
                    </div>
                    <div className="div-table-header" style={{ width: '10%' }}>
                      Status
                    </div>
                    <div className="div-table-header" style={{ width: '13%' }}>
                      Created
                    </div>
                    <div className="div-table-header" style={{ width: '13%' }}>
                      Updated
                    </div>
                    <div className="div-table-header" style={{ width: '20%' }}>
                      Actions
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
                          {res.status === 2 ? (
                            <div>No Actions, Request Rejected</div>
                          ) : (
                            <div className="div-actions">
                              <a
                                className="btn btn-success btn-sm"
                                href="#"
                                onClick={() => props.onAccept(res.tempresid)}
                              >
                                Accept
                              </a>
                              <a
                                className="btn btn-danger btn-sm"
                                href="#"
                                onClick={() => props.onReject(res.tempresid)}
                              >
                                Reject
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

        <div className="container text-center mt-5">
          <p>
            Are you a librarian and want to register a new library into the
            system?
          </p>
          <a className="btn btn-primary" href="/register-library/">
            Register Your Library
          </a>
        </div>
      </>
    </LandingPageBox>
  );
};
    
export default LandingPageLibrariesBox;