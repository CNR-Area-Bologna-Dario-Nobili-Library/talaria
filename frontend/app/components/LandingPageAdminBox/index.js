import React from 'react';
import {Button} from 'reactstrap'
import './style.scss'
import LandingPageBox from '../LandingPageBox';
import { Link } from 'react-router-dom';

const LandingPageAdminBox = (props) => {
    const {auth,title, match,canCollapse,collapsed}=props
   
    return (
    
        (auth.permissions.roles && ( auth.permissions.roles.includes("super-admin") || auth.permissions.roles.includes("manager") || auth.permissions.roles.includes("accountant")) ) &&                     
            <LandingPageBox iconClass="fa-solid fa-gear" title={title} canCollapse={canCollapse} collapsed={collapsed} >                
                <Link className="btn btn-success" to="/admin" >
                    GO
                </Link>

            </LandingPageBox>
        
    )
}


export default LandingPageAdminBox;
