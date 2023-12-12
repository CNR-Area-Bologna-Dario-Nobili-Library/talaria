import React from 'react';
import {Button} from 'reactstrap'
import './style.scss'
import LandingPageBox from '../LandingPageBox';
import { Link } from 'react-router-dom';

const LandingPageInstitutionsBox = (props) => {
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
         (auth.permissions.resources.institutions && auth.permissions.resources.institutions.length>=1 /* or pending requests */  &&                                        
            <LandingPageBox iconClass="fa-solid fa-building" title={title} canCollapse={canCollapse} collapsed={collapsed} >
                <p>Institutions permissions + pending</p>
                { auth.permissions.resources.institutions.map((res,i)=> (
                    <div className="permissionsBox" key={`row-${res.resource.id}`}>                            
                        <span>{res.resource.name}</span>
                        <span>{res.permissions.map((p,i)=>(
                            <span className={"badge "+badgeType(p)}>{p}</span>
                        ))}</span> 
                        <Link className="btn btn-sm btn-primary" to={'/institution/'+res.resource.id} key={'ins'+res.resource.id}>GO!</Link> 
                    </div>)
                )}


            </LandingPageBox>        
        )|| <></>        
    )
}

export default LandingPageInstitutionsBox;
