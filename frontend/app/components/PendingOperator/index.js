import React, {useEffect, useState} from 'react'
import {Button} from 'reactstrap'
import {useIntl} from 'react-intl';
import './style.scss';
import messages from './messages';
import { Link } from 'react-router-dom';

import {permissionBadgeClass} from '../../utils/utilityFunctions.js'
import { formatDateTime } from '../../utils/dates.js';

const PendingOperator = (props) => {
    const {data,deleteOpCallback,enableDelete} = props

    const user_name=data.user?data.user.data.name:data.user_name
    const user_surname=data.user?data.user.data.surname:data.user_surname
    const user_email=data.user?data.user.data.email:data.user_email
    const status=data.status
    
    

    const intl = useIntl()

    console.log('PendingOperator', props)

    const pendingStatusClass = status => {
        switch (status) {
          case 0:
            return 'pending';
            break;
          // case 1: return 'success'; break;
          case 2:
            return 'disabled';
            break;
        }
        return status;
      };
      

    
    return (
    <div className="container pendingoperator">                     
        <div className='row'>
            <div className='col col-md-3'>
                {user_name} {user_surname} ({user_email})             
            </div>
            <div className='col col-md-2'>
                {data.abilities && data.abilities.split(',').map((p,i)=>(
                                    <span key={"badge_temp_perm_"+i} className={"badge "+permissionBadgeClass(p)}>{p}</span>
                ))}
            </div>
            <div className='col col-md-1'>
                <div className={`status-point ${pendingStatusClass(status)}`}></div>
            </div>
            <div className='col col-md-2'>        
                {formatDateTime(data.created_at)}
            </div>
            <div className='col col-md-2'>
                {formatDateTime(data.updated_at)}
            </div>
            <div className='col col-md-2'>
                {enableDelete && deleteOpCallback && <a className="btn btn-sm btn-danger" onClick={()=>deleteOpCallback()} key={'deletebutton'}>{intl.formatMessage({id: "app.global.delete"})}</a>}
            </div>
        </div>
 
    </div>
    )
} 

export default PendingOperator