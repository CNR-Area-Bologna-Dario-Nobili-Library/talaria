import React from 'react';
import {Link} from 'react-router-dom';
import { generatePath } from "react-router";
import ApplyTag from '../../ApplyTag';
import { useIntl } from 'react-intl';


const ReferenceIcons = (props) => {
    const {data,customClass,deleteReference,icons, labelsOptionList, groupsOptionList , applyGroups, applyLabels, selectedReferences,findAndUpdateOA} = props
    
    const intl=useIntl();

    const referenceUrl='/patron/references/:id?/:op?';
    
    const editurl = (id) => {
        return generatePath(`${referenceUrl}`, {
            id,
            op: "edit"
        });
    }
    const requesturl = (id) => {
        return generatePath(`${referenceUrl}`, {
            id,
            op: "request"
        });
    }    
   
    const canEdit = (data) => {
        if(data.patronrequests==0) return true;
        return false;
    }

    const canRequest = (data) => {
        if(data.active_patronrequests==0) return true;
        return false;
    }

    const canDelete = (data) => {
        return canRequest(data);
    }

    const visibleIcon = (icon) => {
        return icons && icons.indexOf(icon)>=0;
    }

    const findOA = (ev,id) => {       
        ev.preventDefault();

        if(findAndUpdateOA)
            findAndUpdateOA(id);
    }


    return ( 
        icons && icons.length>0 && 
        <div className={`${customClass}`}>
                {visibleIcon('request') && 
                 <Link to={`${requesturl(data.id)}`}  className="btn btn-icon">
                    <i className="fa-solid fa-share"></i>                    
                 </Link>
                }
                {visibleIcon('oa') && data.oa_link && <a href={data.oa_link} target="_blank" className='btn btn-icon'><i className="icon-oa"></i></a>}
                {visibleIcon('oa') && !data.oa_link && <a target="_blank" className='btn btn-icon' onClick={(ev) => findAndUpdateOA(ev,data.id) } title={intl.formatMessage({id: "app.requests.icon.referenceCheckOA"})}><i className="fa-solid fa-magnifying-glass-plus"></i></a>}
                {visibleIcon('print') && <a className="btn btn-icon" onClick={() => console.log("print") }>
                    <i className="fa-solid fa-print"></i>
                </a>}
                {visibleIcon('export') && <a className="btn btn-icon" onClick={() => console.log("export") }>
                    <i className="fa-solid fa-file-export"></i>
                </a>}
                { visibleIcon('assignLabel') && applyLabels &&  
                    <ApplyTag
                        type="label"
                        submitCallBack={(id) => applyLabels(id, selectedReferences)}
                        options={labelsOptionList} 
                    /> 
                }
                {visibleIcon('assignGroup') && applyGroups &&
                    <ApplyTag
                        type="group"
                        submitCallBack={(ids) => applyGroups(ids, selectedReferences)}
                        options={groupsOptionList} 
                    /> 
                }
                {visibleIcon('edit') && data.id &&                 
                <Link to={canEdit(data)?editurl(data.id):'#'} className={`${canEdit(data)?'btn btn-icon':'btn btn-icon disabled'}`}>
                    <i className="fa-solid fa-pen-to-square"></i>
                </Link>}               
                {visibleIcon('delete') && data.id && canDelete(data) && 
                (                                           
                        <Link to='#' className={canDelete(data) && deleteReference?"btn btn-icon":"btn btn-icon disabled"} onClick={() => deleteReference(data.id) }>
                            <i className="fa-solid fa-trash"></i>
                        </Link>
                )
                }                
        </div>
    )
}

export default ReferenceIcons