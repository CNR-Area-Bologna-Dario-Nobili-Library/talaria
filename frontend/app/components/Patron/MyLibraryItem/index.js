import React, {useState} from 'react';
import {NavLink} from 'react-router-dom';
import { useIntl } from 'react-intl';
import {UncontrolledTooltip, Row, Col, Button} from 'reactstrap';
import { generatePath } from "react-router";

import './style.scss';

const MyLibraryItem = props => {
    console.log('MyLibraryItem', props);
    const {data, editPath, setPreferred, preferred,  deleteCallback} = props;

    const intl=useIntl();
   // const [favoriteStar, setPreferredStar] = useState(data.preferred);
    // const [tooltipOpen, setTooltipOpen] = useState(false);
    // const toggle = () => setTooltipOpen(!tooltipOpen); 
    
    const editurl = (library_id, id) => {
        return generatePath(`${editPath}`, {
            library_id,
            id
        });
    }  

    const statusClass = (status) => {
        switch (status)
        {
            case 0: return 'disabled'; break;
            case 1: return 'success'; break;
            case 2: return 'pending'; break;
        }
        return status;
    }

    const preferredStarClass = (pref) => {
        switch (pref)
        {
          case false: return 'notpreferred'; break;
          case true: return 'preferred'; break;
          default: return 'notpreferred'; break;
        }
        return pref;
    }
  

    return (
        <Row className="list-row my-libraries-item justify-content-between">
            <Col sm={3} className="">                
                {data.status === 1 && <a onClick={setPreferred}>
                    <i className={`fa-solid fa-star preferred-star ${preferredStarClass(data.id===preferred)}`}></i>
                </a>}
                &nbsp;&nbsp;
                <div className="status-block">
                    <div className={`status-point ${statusClass(data.status)}`}></div>                    
                </div>
                <div>{data.created_at && <p>{new Date(data.created_at).toLocaleDateString()}</p>}</div>
            </Col>
            <Col sm={4} className="info">       
                {data.name}<br/>
                {data.label?"("+data.label+")":''}              
            </Col>
            <Col sm={3} className="info">
                {data.department_name && <div><span className="font-weight-bold">{intl.formatMessage({id:'app.global.department'})}</span>: <span>{data.department_name}</span></div>}
                {data.title_name && <div><span className="font-weight-bold">{intl.formatMessage({id:'app.global.title'})}</span>: <span>{data.title_name}</span></div>}
                {data.user_referent && <div><span className="font-weight-bold">{intl.formatMessage({id:'app.containers.MyLibrariesPage.user_referent'})}</span>: <span>{data.user_referent}</span></div> }
                {data.user_service_phone && <div><span className="font-weight-bold">{intl.formatMessage({id:'app.containers.MyLibrariesPage.user_service_phone'})}</span>: <span>{data.user_service_phone}</span></div> }
                {data.user_service_email && <div><span className="font-weight-bold">{intl.formatMessage({id:'app.containers.MyLibrariesPage.user_service_email'})} </span>: <span>{data.user_service_email}</span></div> }
            </Col>
            <Col sm={2} className="icons align-self-center">                
                <NavLink to={`${editurl(data.library_id, data.id)}`}  className="btn btn-icon">
                    <i className="fa-solid fa-pen-to-square"></i>                    
                 </NavLink>
                <a href="#"  className="btn btn-icon" onClick={deleteCallback}>
                    <i className="fa-solid fa-trash"></i>
                </a>
            </Col>  
        </Row>
    );
};

export default MyLibraryItem;