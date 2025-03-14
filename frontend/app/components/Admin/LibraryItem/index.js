import React,{useState} from 'react';
import {Row, Col, Button} from 'reactstrap';
import {useIntl} from 'react-intl';
import { generatePath } from "react-router";
import { formatDateTime } from '../../../utils/dates';
import CustomCheckBox from 'components/Form/CustomCheckBox';
//import RequestTags from '../RequestTags';
import './style.scss';
import { Link } from 'react-router-dom';
import LibraryInformations from '../../Library/LibraryInformations';
import {libraryStatusIcon}  from '../../../utils/utilityFunctions';


export const editurl=(reqPath,id,op) => {
    return generatePath(reqPath, {
        id,
        op
    });
}



export const manageoperatorsurl=(reqPath,id) => {
    return generatePath(reqPath, {
        id,        
    });
}

export const canEnable = (lib) => {    
    if( 
        (lib.status==-1 || 
        lib.status==2 || 
        lib.status==0 || 
        lib.status==3 ||
        lib.status==5 ) && (lib.institution && lib.institution.data.status==1) 
    ) return true;

    return false;
}

export const canDelete = (lib) => {
    return lib.status==-1
}

export const canDisable = (lib) => {
    if( lib.status==1 || lib.status==2|| lib.status==4)        
     return true;

    return false;
}

export const canDisableBad = (lib) => {
    if( lib.status==1)        
     return true;

    return false;
}

export const canDisableDidntPaid = (lib) => {
    if( lib.status==1)        
     return true;

    return false;
}

export const canDisableSubscriptionExpired = (lib) => {
    if(lib.status==2)        
     return true;

    return false;
}
export const canRenew = (lib) => {
    if( lib.status==1||
        lib.status==0||
        lib.status==4
        
    )        
     return true;

    return false;
}





export const LibraryOperations = (props) => {
    const {data,changeStatusLibrary,deleteLibrary}=props;    

    let intl=useIntl();
      
    return (        
        <div className={"library_operations"}>                                                                            
                {canDelete(data) && deleteLibrary && <a className="btn btn-icon btn-sm" onClick={()=>deleteLibrary()}  title={intl.formatMessage({id: "app.manager.libraries.icon.delete"})}><i className="fa-solid fa-trash"></i></a>}                                                
                {canEnable(data) && changeStatusLibrary && <a className="btn btn-icon btn-sm" onClick={()=>changeStatusLibrary(1)}  title={intl.formatMessage({id: "app.manager.libraries.icon.enable"})}><i className="fa-solid fa-circle-check"></i></a>}                                                
            
                {canDisable(data) && changeStatusLibrary && <a className="btn btn-icon btn-sm" onClick={()=>changeStatusLibrary(0)}  title={intl.formatMessage({id: "app.manager.libraries.icon.disable"})}><i className="fa-solid fa-ban"></i></a>}
                {canDisableBad(data) && changeStatusLibrary && <a className="btn btn-icon btn-sm" onClick={()=>changeStatusLibrary(3)}  title={intl.formatMessage({id: "app.manager.libraries.icon.disableBad"})}><i className="fa-solid fa-poo"></i></a>}
                {canDisableDidntPaid(data) && changeStatusLibrary && <a className="btn btn-icon btn-sm" onClick={()=>changeStatusLibrary(5)}  title={intl.formatMessage({id: "app.manager.libraries.icon.disableNotPay"})}><i className="fa-solid fa-coins"></i></a>}
                {canDisableSubscriptionExpired(data) && changeStatusLibrary && <a className="btn btn-icon btn-sm" onClick={()=>changeStatusLibrary(4)}  title={intl.formatMessage({id: "app.manager.libraries.icon.disableExpired"})}><i className="fa-solid fa-stopwatch"></i></a>}                        
                
                {canRenew(data) && changeStatusLibrary && <a className="btn btn-icon btn-sm" onClick={()=>changeStatusLibrary(2)}  title={intl.formatMessage({id: "app.manager.libraries.icon.renew"})}><i className="fa-solid fa-rotate-right"></i></a>}                                                                                                
        </div>
    )
}


const LibraryItem = (props) => {
    const {editPath,data,toggleSelection,checked,removeTag,deleteLibrary,changeStatusLibrary} = props      
    const intl = useIntl();  

    const subscriptionurl=(reqPath,id) => {
        return generatePath(reqPath, {
            id,
            op: 'subscriptions'
        });        
    }

    return (
        <Row className="library_item list-row">
            <Col xs={12} md={5}>
                <CustomCheckBox 
                    handleChange={toggleSelection}
                    checked={checked}
                /> 
               <LibraryInformations data={data} detailUrl={editurl(editPath,data.id)}  showILLInfo={false} showPaymentInfo={true}/>
            </Col>
            <Col xs={1} md={1}>
                <div className='library_status'>{libraryStatusIcon(data.status)}</div> 
                
                {data.institution && data.institution.data.status!=1 && <>&nbsp;<i className='fa-solid fa-triangle-exclamation text-danger'  title={intl.formatMessage({id: "app.manager.libraries.icon.institution_warning"})}></i></>}
            </Col>
            <Col xs={5} md={2}>                                                      
                {/*<Link className="btn btn-icon btn-sm" to={subscriptionurl(editPath,data.id)}><i className="fa-solid fa-file-contract"></i></Link>*/} 
                {formatDateTime(data.created_at)}
            </Col>            
            <Col xs={12} md={4}>      
            <LibraryOperations data={data} changeStatusLibrary={changeStatusLibrary} deleteLibrary={deleteLibrary}/>                
            </Col>            
        </Row>
    )
}

export default LibraryItem