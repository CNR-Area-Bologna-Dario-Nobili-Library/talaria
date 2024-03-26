import React from 'react';
import {Button} from 'reactstrap'
import './style.scss'
import LandingPageBox from '../LandingPageBox';
import { Link } from 'react-router-dom';
import {formatDateTime} from '../../utils/dates';

import {permissionBadgeClass} from '../../utils/utilityFunctions.js'

const LandingPageProjectsBox = (props) => {
    const {auth,title,match,canCollapse,collapsed}=props
        
    return (
         
            <LandingPageBox iconClass="fa-solid fa-diagram-project" title={title} canCollapse={canCollapse} collapsed={collapsed} >            
             <p>bla bla bla</p>  
            <>
                    {auth.permissions.resources.projects && auth.permissions.resources.projects.length>=1 /* or pending requests */  &&                                        
                     <div>
                        <h3>Current permissions</h3>
                        { auth.permissions.resources.projects.map((res,i)=> (
                            <div className="permissionsBox" key={`row-${i}`}>                            
                                <span>{res.resource.name}</span>
                                <span>{res.permissions.map((p,i)=>(
                                    <span className={"badge "+permissionBadgeClass(p)}>{p}</span>
                                ))}</span> 
                                <Link className="btn btn-sm btn-primary" to={'/project/'+res.resource.id} key={'prj'+res.resource.id}>GO!</Link> 
                            </div>)
                        )}
                      </div>
                    }
                                       
                    {auth.permissions.tempresources && auth.permissions.tempresources.projects && 
                    <div>
                        <h3>Pending/Rejected requests</h3>
                        { auth.permissions.tempresources.projects.map((res,i)=> (
                            <div className="permissionsBox" key={`pendrow-${i}`}>                            
                                <span>{res.resource.name}</span>
                                <span>{res.permissions.map((p,i)=>(
                                <span key={"badge_temp_perm_"+i} className={"badge "+permissionBadgeClass(p)}>{p}</span>
                                ))}</span>                                                        
                                <span>{res.status}</span>
                                <span>{formatDateTime(res.created_at)}</span>
                                <span>{formatDateTime(res.updated_at)}</span>
                                {res.status==0 && <Link className="btn btn-sm btn-success" to="#">Accept</Link>}
                                {res.status==0 && <Link className="btn btn-sm btn-danger" to="#">Reject</Link>}
                            </div>)
                        )}
                    </div>                    
                    }  
                </>





            </LandingPageBox>                
    )
}

export default LandingPageProjectsBox;
