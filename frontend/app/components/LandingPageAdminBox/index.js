import React from 'react';
import {Button} from 'reactstrap'
import './style.scss'
import LandingPageBox from '../LandingPageBox';
import { Link } from 'react-router-dom';
import {useIntl} from 'react-intl'

const LandingPageAdminBox = (props) => {
    const {auth,title, intro,match,canCollapse,collapsed}=props
    
    const intl=useIntl();  
   
    return (            
        (auth.permissions.roles && ( auth.permissions.roles.includes("super-admin") || auth.permissions.roles.includes("manager") || auth.permissions.roles.includes("accountant")) ) &&                     
            <LandingPageBox iconClass="fa-solid fa-gear" title={title} intro={intro} canCollapse={canCollapse} collapsed={collapsed} >                               
                {auth.permissions.roles.includes("super-admin") && 
                <Link className="btn btn-primary" to="/admin" >
                    <i className={`fa-solid fa-gear`}></i> {intl.formatMessage({id:'app.components.HeaderBar.AdminDashboard'})}
                </Link>}
                &nbsp;
                {(auth.permissions.roles.includes("super-admin") || auth.permissions.roles.includes("manager")) && 
                <Link className="btn btn-primary" to="/admin" >
                    <i className={`fa-solid fa-home`}></i> {intl.formatMessage({id:'app.components.HeaderBar.ManagerDashboard'})}
                </Link>}
                &nbsp;
                {(auth.permissions.roles.includes("super-admin") || auth.permissions.roles.includes("accountant") )&& 
                <Link className="btn btn-primary" to="/admin" >
                    <i className={`fa-solid fa-wallet`}></i> {intl.formatMessage({id:'app.components.HeaderBar.AccountantDashboard'})}
                </Link>}


            </LandingPageBox>
        
    )
}


export default LandingPageAdminBox;
