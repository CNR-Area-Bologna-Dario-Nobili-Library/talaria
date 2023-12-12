import React, {useState} from 'react';
import {Card,CardBody, CardHeader} from 'reactstrap'
import './style.scss'

const LandingPageBox = (props) => {
    const {customClass,canCollapse=true,collapsed=false, title, iconClass=""} = props

    const [openBox,setOpenBox]=useState(canCollapse?!collapsed:true)  
    
    return (
        <Card className="landingPageBox p-2">
            <CardHeader className="landingBoxTitle">                                
                {canCollapse && <a className="toggle-box-link" onClick={()=>setOpenBox(!openBox)}>
                    <i className={`fas ${openBox?'fa-toggle-on':'fa-toggle-off'}`}></i> 
                </a>}
                {iconClass?<i className={iconClass}></i>:''} {title}
            </CardHeader>                              
            {openBox && <CardBody className="p-4">                               
                {props.children}
            </CardBody>}
        </Card>
    )
}


export default LandingPageBox;
