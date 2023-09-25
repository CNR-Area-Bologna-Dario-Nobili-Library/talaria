import React from 'react'
import {useIntl} from 'react-intl';
import './style.scss';
import globalMessages from 'utils/globalMessages';
import messages from './messages';
import {CustomForm} from 'components';

 


const InstitutionSearchForm = (props) => {
    const {searchFields,searchCallback,institutionTypesOptionList,countriesOptionList,subjectOptionList,identifierTypesOptionList} = props      
    const intl = useIntl();      
    
    const statusOptionList =  [
        {value:'0',label:intl.formatMessage({id:'app.institutions.status.disabled'})},
        {value:'1',label:intl.formatMessage({id:'app.institutions.status.enabled'})},
        {value:'2',label:intl.formatMessage({id:'app.institutions.status.pending'})},
        
    ];

    
 

    const doSearch=(formData)=> 
    {        
        let params={
            'query':formData.name,
            'country': formData.country_id,
            'institution_type': formData.institution_type_id,
            'status': formData.status
        }

        
        searchCallback(params);
    }

    return (
        <div className="InstitutionSearchForm">  
        <CustomForm 
                    submitCallBack={(formData) => doSearch(formData)}                    
                    fields={searchFields}                    
                    title={intl.formatMessage(messages.header)}                    
                    institution_type_id={institutionTypesOptionList}
                    country_id={countriesOptionList}                                   
                    status={statusOptionList}
                    messages={{...globalMessages,...messages}}       
                    submitText={intl.formatMessage({id:'app.global.search'})}             
                    backButton={false}
                    resetButton={true}
                />
        </div>
    )
}

export default InstitutionSearchForm;