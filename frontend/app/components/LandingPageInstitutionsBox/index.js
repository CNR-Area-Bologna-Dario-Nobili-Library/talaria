import React from 'react';
import {Button} from 'reactstrap'
import './style.scss'
import LandingPageBox from '../LandingPageBox';

const LandingPageInstitutionsBox = (props) => {
    const {auth,title,match,canCollapse,collapsed}=props

    const go = () => {
        alert("GO!!!")
    }
    
    return (
         (auth.permissions.resources.institutions && auth.permissions.resources.institutions.length>=1 /* or pending requests */  &&                                        
            <LandingPageBox  title={title} canCollapse={canCollapse} collapsed={collapsed} >
                <p>Institutions permissions + pending</p>
                <Button color="success" onClick={()=>go()} >
                    GO
                </Button>

            </LandingPageBox>        
        )|| <></>        
    )
}

export default LandingPageInstitutionsBox;
