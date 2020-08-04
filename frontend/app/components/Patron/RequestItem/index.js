import React, {useState, useEffect} from 'react';
import {UncontrolledTooltip, Row, Col} from 'reactstrap';
import {NavLink } from 'react-router-dom';
import { generatePath } from "react-router";
import {useIntl} from 'react-intl';
import messages from './messages';
import CustomCheckBox from 'components/Form/CustomCheckBox';
import {formatDate} from 'utils/dates';
import './style.scss';

const RequestItem = (props) => {
    const {data, editPath,toggleSelection,checked} = props
    const intl = useIntl();
        
    
    const matTypeIcon = (mat) => {
        switch (mat)
        {
          case 1: return 'simple_icon fas fa-newspaper'; break;
          case 2: return 'simple_icon fas fa-book'; break;
          case 3: return 'simple_icon icon-diploma'; break;
        }
        return mat;
      }
    
      const statusIcon = (status_key) => {
          return "status-icon " + status_key
      }
    
    const requesturl=(id) => {
        return generatePath(`${editPath}`, {
            id
        });
    }

    const canArchive = (data) => {
        if(data.status_key=="canceled" || data.status_key=="received"|| data.status_key=="fileReceived" || data.status_key=="notReceived") return true;
        return false;
    }

    const canDelete = (data) => {
        if(! (data.status_key=="canceled" || data.status_key=="received"|| data.status_key=="fileReceived" || data.status_key=="notReceived" ) ) return true;
        return false;
    }

    return ( 
        <Row className="list-row justify-content-between">
            <Col sm={3} className="select-checkbox">
                <CustomCheckBox 
                    handleChange={toggleSelection}
                    checked={checked}
                />
                <span className={statusIcon(data.status_key)}></span> 
                <span className="status-text">{intl.formatMessage(messages[data.status_key])}</span>
                <i className={matTypeIcon(data.reference.data.material_type)}></i>
            </Col>
            <Col sm={7} className="info">
                <NavLink to={`${requesturl(data.id)}`}>
                    <p><span className="pub_title">{data.reference.data.pub_title}</span> <span className="part_title">{data.reference.data.part_title}</span></p>
                </NavLink>
                <div className="authors">
                   {data.reference.data.first_author && <span className="first_author">Autore <span>{data.reference.data.first_author}</span></span>} 
                   <span className="pubyear">Anno <span>{data.reference.data.pubyear}</span></span>
                </div>
                {data.library && 
                    <span className="libraryLabel">
                        <span>Biblioteca</span> 
                        <span>{data.library_label.data.label} 
                            <i id={`tooltip-${data.id}`} className="fas fa-info-circle"></i>
                            <UncontrolledTooltip placement="right" trigger="click"  target={`tooltip-${data.id}`}>
                                {data.library.data.name}
                            </UncontrolledTooltip>
                        </span>
                    </span> }
                {data.delivery && <span className="delivery"><span>Delivery</span> <span>{data.delivery.data.name}</span></span>}
                {data.request_date && <span className="requestDate"><span>Data richiesta</span> <span>{formatDate(data.request_date, 'it')}</span></span>}
                {data.fullfill_date && <span className="fullfillDate"><span>Data evasione</span> <span>{formatDate(data.fullfill_date, 'it')}</span></span>}
                
                {data.reference.data.labels.data && <span className="labels-row">
                    {data.reference.data.labels.data.map(label => <span key={label.id}>{label.name}</span>)}
                </span>}
                {data.reference.data.groups.data && <span className="groups-row">
                    {data.reference.data.groups.data.map(grp => <span key={grp.id}>{grp.name}</span>)}
                </span>}
                
            </Col>
            
            <Col sm={2} className="icons align-self-center">
            {!data.archived && 
            <>
                {canArchive(data) && <NavLink to="#" className="btn btn-icon">
                    <i className="fas fa-hdd"></i>
                </NavLink>}
                {canDelete(data) && <a href="#" onClick={() => console.log('delete request')} className="btn btn-icon">
                    <i className="fas fa-trash"></i>
                </a> }
            </>
            }
            </Col> 
        </Row>
        
    )
}

export default RequestItem