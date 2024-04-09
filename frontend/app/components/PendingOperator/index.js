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

    
    return (
    <div className="pendingoperator">                     
        <span>{user_name} {user_surname} ({user_email}) </span>&nbsp;&nbsp;        
        <span>{data.abilities && data.abilities.split(',').map((p,i)=>(
                              <span key={"badge_temp_perm_"+i} className={"badge "+permissionBadgeClass(p)}>{p}</span>
        ))}
        </span>&nbsp;&nbsp;
        <span>{status}</span>&nbsp;&nbsp;        
        <span>{formatDateTime(data.created_at)}</span>&nbsp;&nbsp;
        <span>{formatDateTime(data.updated_at)}</span>&nbsp;&nbsp;
        <span>            
            {enableDelete && deleteOpCallback && <a className="btn btn-sm btn-danger" onClick={()=>deleteOpCallback()} key={'deletebutton'}>{intl.formatMessage({id: "app.global.delete"})}</a>}
        </span>
    </div>
    )
} 

export default PendingOperator