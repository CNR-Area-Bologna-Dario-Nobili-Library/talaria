import React from 'react'
import {useIntl} from 'react-intl';
import './style.scss';
import globalMessages from 'utils/globalMessages';
import messages from './messages';
import {CustomForm} from 'components';

 


const LibrarySearchForm = (props) => {
    const {searchFields,searchCallback,institutionTypesOptionList,countriesOptionList,subjectOptionList,identifierTypesOptionList} = props      
    const intl = useIntl();      

    const profileTypeOptionList =  [
        {value:1, label: intl.formatMessage({id:'app.libraries.profile_type.basic'})},
        {value:2, label:intl.formatMessage({id:'app.libraries.profile_type.full'})}
    ];

    const statusOptionList =  [
        {value:'-1', label: intl.formatMessage({id:'app.libraries.status.new'})},        
        {value:'0',label:intl.formatMessage({id:'app.libraries.status.disabled'})},
        {value:'1',label:intl.formatMessage({id:'app.libraries.status.enabled'})},
        {value:'2',label:intl.formatMessage({id:'app.libraries.status.renewing'})},
        {value:'3',label:intl.formatMessage({id:'app.libraries.status.disabled_bad'})},
        {value:'4',label:intl.formatMessage({id:'app.libraries.status.disabled_subscription_expired'})},
        {value:'5',label:intl.formatMessage({id:'app.libraries.status.disabled_didntpaid'})},
    ];

    
 

    const doSearch=(formData)=> 
    {        
            let params={
                'query':formData.name,
                'country': formData.country_id,
                'subject': formData.subject_id,
                'institution_type': formData.institution_type_id,
                'identifier_type': formData.identifier_type_id,
                'identifier_code': formData.identifier_code,
            }

            if(formData.profile_type)
            {    params={
                    ...params,
                    'profile_type': formData.profile_type
                }
            }

            if(formData.status)
            {
                params={
                    ...params,
                    'status': formData.status
                }
            }

        
        searchCallback(params);
    }

    return (
        <div className="LibrarySearchForm">  
        <CustomForm
                    submitCallBack={(formData) => doSearch(formData)}                    
                    fields={searchFields}                    
                    title={intl.formatMessage(messages.header)}                    
                    institution_type_id={institutionTypesOptionList}
                    country_id={countriesOptionList}
                    subject_id={subjectOptionList}                    
                    identifier_type_id={identifierTypesOptionList}
                    profile_type={profileTypeOptionList}
                    status={statusOptionList}
                    messages={{...globalMessages,...messages}}       
                    submitText={intl.formatMessage({id:'app.global.search'})}             
                    backButton={false}
                    resetButton={true}
                />
        </div>
    )
}

export default LibrarySearchForm;