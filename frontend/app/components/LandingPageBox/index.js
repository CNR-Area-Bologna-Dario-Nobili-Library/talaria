import React, {useState} from 'react';
import {Card,CardBody, CardHeader, CardText, CardTitle} from 'reactstrap'
import './style.scss'

const LandingPageBox = (props) => {
    const {customClass,canCollapse=true,collapsed=false, intro, title, iconClass=""} = props

    const [openBox,setOpenBox]=useState(canCollapse?!collapsed:true)  
    
    return (
        <Card className="landingPageBox">
            <CardHeader className="landingBoxTitle">                                
                {canCollapse && <a className="toggle-box-link" onClick={()=>setOpenBox(!openBox)}>
                    <i className={`fas ${openBox?'fa-toggle-on':'fa-toggle-off'}`}></i> 
                </a>}
                {iconClass?<i className={iconClass}></i>:''} {title}
            </CardHeader>                              
            <CardBody>                                   
                {intro && <CardTitle>{intro}</CardTitle>}                   
                {openBox && 
                    props.children
                }                
            </CardBody>
            {!openBox && <div class="card-footer text-muted" style={{ textAlign: 'center' }}>
                <a onClick={()=>setOpenBox(!openBox)} className='btn-sm btn-link' style={{ cursor: 'pointer' }}>
                    <i class="fa-solid fa-ellipsis"></i>
                </a>           
            </div>}
        </Card>
    )
}


export default LandingPageBox;
