import React from 'react';
import {Button} from 'reactstrap'
import './style.scss'
import LandingPageBox from '../LandingPageBox';
import { Link } from 'react-router-dom';
import {formatDateTime} from '../../utils/dates';
import {permissionBadgeClass} from '../../utils/utilityFunctions.js'

const LandingPageConsortiasBox = (props) => {
    const {auth,title,match,history,canCollapse,collapsed}=props

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
    console.log('LandingPageConsortiaBox', props);


    return (
        <LandingPageBox
          iconClass="fa-solid fa-landmark"
          title={title}
          canCollapse={canCollapse}
          collapsed={collapsed}
        >
          <>
            {auth.permissions.resources.consortia &&
              auth.permissions.resources.consortia.length >= 1 && (
                <div className="container">
                  <h3 className="text-center mb-4">Current Permissions</h3>
                  <div className="div-responsive">
                    <div className="div-table">
                      <div className="div-table-row">
                        <div className="div-table-header" style={{ width: '25%' }}>
                          Consortium
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
                      {auth.permissions.resources.consortia.map((res, i) => (
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
                                to={'/consortia/' + res.resource.id}
                              >
                                Visit This consortium
                              </Link>
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
              auth.permissions.tempresources.consortia &&
              auth.permissions.tempresources.consortia.filter(
                res => res.status === 0 || res.status === 2,
              ).length > 0 && (
                <div className="container">
                  <h3 className="text-center mb-4">Pending/Rejected Requests</h3>
                  <div className="div-responsive">
                    <div className="div-table">
                      <div className="div-table-row">
                        <div className="div-table-header" style={{ width: '25%' }}>
                          Consortium
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
                      {auth.permissions.tempresources.consortia
                        .filter(res => res.status === 0 || res.status === 2) // Filter the Consortium with status 0 or status 2
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
                                    onClick={() => props.onAccept(res.id)}
                                  >
                                    Accept
                                  </a>
                                  <a
                                    className="btn btn-danger btn-sm"
                                    href="#"
                                    onClick={() => props.onReject(res.id)}
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
          </>
        </LandingPageBox>
      );
    };

    export default LandingPageConsortiasBox