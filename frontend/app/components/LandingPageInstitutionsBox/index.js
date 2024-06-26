import React from 'react';
import {Button} from 'reactstrap'
import './style.scss'
import LandingPageBox from '../LandingPageBox';
import { Link } from 'react-router-dom';
import {formatDateTime} from '../../utils/dates';
import {permissionBadgeClass} from '../../utils/utilityFunctions.js'

const LandingPageInstitutionsBox = (props) => {
    const {auth,title,match,canCollapse,collapsed}=props

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
            {auth.permissions.resources.institutions &&
              auth.permissions.resources.institutions.length >= 1 && (
                <div className="container">
                  <h3 className="text-center mb-4">Current Permissions</h3>
                  <div className="div-responsive">
                    <div className="div-table">
                      <div className="div-table-row">
                        <div className="div-table-header" style={{ width: '25%' }}>
                          Institution
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
                      {auth.permissions.resources.institutions.map((res, i) => (
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
                                to={'/institution/' + res.resource.id}
                              >
                                Visit This Institution
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
              auth.permissions.tempresources.institutions &&
              auth.permissions.tempresources.institutions.filter(
                res => res.status === 0 || res.status === 2,
              ).length > 0 && (
                <div className="container">
                  <h3 className="text-center mb-4">Pending/Rejected Requests</h3>
                  <div className="div-responsive">
                    <div className="div-table">
                      <div className="div-table-row">
                        <div className="div-table-header" style={{ width: '25%' }}>
                        Institution
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
                      {auth.permissions.tempresources.institutions
                        .filter(res => res.status === 0 || res.status === 2) // Filter the institutions with status 0 or status 2
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
    
            {/* <div className="container text-center mt-5">
              <p>
                Are you a librarian and want to register a new library into the
                system?
              </p>
              <a className="btn btn-primary" href="/register-library/">
                Register Your Library
              </a>
            </div> */}
          </>
        </LandingPageBox>
      );
    };

    
//     return (         
//             <LandingPageBox iconClass="fa-solid fa-building" title={title} canCollapse={canCollapse} collapsed={collapsed} >
//                 <p>bla bla bla</p>   
//                 <>
//                     {auth.permissions.resources.institutions && auth.permissions.resources.institutions.length>=1 /* or pending requests */  &&                                        
//                      <div>
//                         <h3>Current permissions</h3>
//                         { auth.permissions.resources.institutions.map((res,i)=> (
//                             <div className="permissionsBox" key={`row-${i}`}>                            
//                                 <span>{res.resource.name}</span>
//                                 <span>{res.permissions.map((p,i)=>(
//                                     <span className={"badge "+permissionBadgeClass(p)}>{p}</span>
//                                 ))}</span> 
//                                 <Link className="btn btn-sm btn-primary" to={'/institution/'+res.resource.id} key={'inst'+res.resource.id}>GO!</Link> 
//                             </div>)
//                         )}
//                       </div>
//                     }
                                        
//                     {auth.permissions.tempresources && auth.permissions.tempresources.institutions && 
//                     <div>
//                         <h3>Pending/Rejected requests</h3>
//                         { auth.permissions.tempresources.institutions.map((res,i)=> (
//                             <div className="permissionsBox" key={`pendrow-${i}`}>                            
//                                 <span>{res.resource.name}</span>
//                                 <span>{res.permissions.map((p,i)=>(
//                                 <span key={"badge_temp_perm_"+i} className={"badge "+permissionBadgeClass(p)}>{p}</span>
//                                 ))}</span>                                                        
//                                 <span>{res.status}</span>
//                                 <span>{formatDateTime(res.created_at)}</span>
//                                 <span>{formatDateTime(res.updated_at)}</span>
//                                 {res.status==0 && <Link className="btn btn-sm btn-success" to="#">Accept</Link>}
//                                 {res.status==0 && <Link className="btn btn-sm btn-danger" to="#">Reject</Link>}
//                             </div>)
//                         )}
//                     </div>                    
//                     }  
//                 </>

//             </LandingPageBox>        
//         )|| <></>            
// }

export default LandingPageInstitutionsBox;
