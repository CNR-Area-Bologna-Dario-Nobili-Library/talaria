import React from 'react';
import {Button} from 'reactstrap'
import './style.scss'
import LandingPageBox from '../LandingPageBox';
import { Link } from 'react-router-dom';
import {formatDateTime} from '../../utils/dates';

const LandingPageConsortiaBox = (props) => {
    const {auth,title,match,canCollapse,collapsed}=props

    const badgeType = (p) => {
        let ty="badge-info";

        switch (p) {
          case 'manage': ty="badge-danger"; break;          
          case 'manage-licenses': ty="badge-dark"; break;       
        }

        return ty;
    }

    return (
         
            <LandingPageBox iconClass="icon icon-consorzio" title={title} canCollapse={canCollapse} collapsed={collapsed} >
                <p>bla bla bla</p>  
                <>               

                {auth.permissions.resources.consortia && auth.permissions.resources.consortia.length>=1 /* or pending requests */  &&                                        
                     <div>
                        <h3>Current permissions</h3>
                        { auth.permissions.resources.consortia.map((res,i)=> (
                            <div className="permissionsBox" key={`row-${res.resource.id}`}>                            
                                <span>{res.resource.name}</span>
                                <span>{res.permissions.map((p,i)=>(
                                    <span className={"badge "+badgeType(p)}>{p}</span>
                                ))}</span> 
                                <Link className="btn btn-sm btn-primary" to={'/consortium/'+res.resource.id} key={'cons'+res.resource.id}>GO!</Link> 
                            </div>)
                        )}
                      </div>
                    }

                {auth.permissions.tempresources && auth.permissions.tempresources.consortia && 
                    <div>
                        <h3>Pending/Rejected requests</h3>
                        { auth.permissions.tempresources.consortia.map((res,i)=> (
                            <div className="permissionsBox" key={`pendrow-${i}`}>                            
                                <span>{res.resource.name}</span>
                                <span>{res.permissions.map((p,i)=>(
                                <span key={"badge_temp_perm_"+i} className={"badge "+badgeType(p)}>{p}</span>
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

export default LandingPageConsortiaBox;
