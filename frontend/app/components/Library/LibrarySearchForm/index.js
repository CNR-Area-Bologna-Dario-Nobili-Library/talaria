import React, {useEffect, useState} from 'react'
import {Row, Col} from 'reactstrap';
import {useIntl} from 'react-intl';
import './style.scss';
import {InputSearch} from 'components';
import globalMessages from 'utils/globalMessages';
import messages from './messages';
import {CustomForm} from 'components';
import {fields} from './fields';
 


const LibrarySearchForm = (props) => {
    const {searchCallback,institutionTypesOptionList,countriesOptionList,subjectOptionList,identifierTypesOptionList} = props      
    const intl = useIntl();      

    const doSearch=(formData)=> {        
        let params={
            'query':formData.name,
            'country': formData.country_id,
            'subject': formData.subject_id,
            'institution_type': formData.institution_type_id,
            'identifier_type': formData.identifier_type_id,
            'identifier_code': formData.identifier_code
        }
        searchCallback(params);
    }

    return (
        <div className="LibrarySearchForm">  
        <CustomForm
                    submitCallBack={(formData) => doSearch(formData)}                    
                    fields={fields}                    
                    title={intl.formatMessage(messages.header)}                    
                    institution_type_id={institutionTypesOptionList}
                    country_id={countriesOptionList}
                    subject_id={subjectOptionList}                    
                    identifier_type_id={identifierTypesOptionList}
                    messages={{...globalMessages,...messages}}       
                    submitText={intl.formatMessage({id:'app.global.search'})}             
                    backButton={false}
                />
        </div>
    )
}

export default LibrarySearchForm;