import React, {useEffect, useState} from 'react'
import {Button} from 'reactstrap'
import {useIntl} from 'react-intl';
import './style.scss';
import messages from './messages';
import { Link } from 'react-router-dom';

import {permissionBadgeClass} from '../../utils/utilityFunctions.js'

const Operator = (props) => {
    const {data,editPath,deleteOpCallback,enableEdit,enableDelete} = props

    const name=data.name
    const surname=data.surname
    const email=data.email
    const full_name=data.full_name

    const intl = useIntl()

    console.log('Operator', props)

    
    return (
    <div className="operator">                     
        <span>{name} {surname} ({full_name}) {email} </span>        
        <span>{data.permissions && data.permissions.map((p,i)=>(
                              <span key={"badge_temp_perm_"+i} className={"badge "+permissionBadgeClass(p)}>{p}</span>
                            ))}</span>  
        <span>
            {enableEdit && editPath && <Link className="btn btn-sm btn-info" to={editPath} key={'editbutton'}>{intl.formatMessage({id: "app.global.edit"})}</Link>}
            {enableDelete && deleteOpCallback && <a className="btn btn-sm btn-danger" onClick={()=>deleteOpCallback()} key={'deletebutton'}>{intl.formatMessage({id: "app.global.delete"})}</a>}
        </span>
    </div>
    )
} 

export default Operator