import React from 'react';
import {Button} from 'reactstrap'
import './style.scss'
import LandingPageBox from '../LandingPageBox';

const LandingPageAdminBox = (props) => {
    const {auth,title, match,canCollapse,collapsed}=props

    const go = () => {
        alert("GO!!!")
    }
    
    return (
    
        (auth.permissions.roles && ( auth.permissions.roles.includes("super-admin") || auth.permissions.roles.includes("manager") || auth.permissions.roles.includes("accountant")) ) &&                     
            <LandingPageBox title={title} canCollapse={canCollapse} collapsed={collapsed} >
                <p>bla bla bla</p>
                <Button color="success" onClick={()=>go()} >
                    GO
                </Button>

            </LandingPageBox>
        
    )
}


export default LandingPageAdminBox;
