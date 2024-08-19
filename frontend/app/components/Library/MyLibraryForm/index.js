import React, { useEffect,useState } from 'react';
// import {Row, Col} from 'reactstrap';
import {CustomForm} from 'components';
import {fields,fieldsGroups} from './fields';
import globalMessages from 'utils/globalMessages';
import messages from './messages';
/* import Loader from 'components/Form/Loader.js';
*/
import {useIntl} from 'react-intl';
import SimpleForm from 'components/SimpleForm'

const MyLibraryForm = (props) => {
console.log('MyLibraryForm', props)
    const { library, usersOptionList,
            searches, loading, resources,
            submitFormAction, libraryProjectsOptionList,institutionsOptionList,institutionTypesOptionList,
            countriesOptionList, librarySubjectOptionList,auth, identifiersOptionList, identifierTypeSelected,institutionsByTypeCountryOptionList,onChangeData} = props

    
            
    const intl = useIntl();
    
    const [requestData,setRequestData]=useState(null);
    const [listLength, setListLength] = useState(null);

    const profileTypeOptionList =  [{value:1, label: intl.formatMessage({id:'app.libraries.profile_type.basic'})},{value:2,label:intl.formatMessage({id:'app.libraries.profile_type.full'})}];

    const enable_change_profile_type=(process.env.LIBRARY_DIFFERENT_PROFILES && process.env.LIBRARY_DIFFERENT_PROFILES=="true")?true:false;

    /*TODO: 
    if ("subscription period"),     
    {
        //can edit subscription related fields + institution when user is not admin/manager...

        fields.institution_type_id.disabled=false
        fields.institution_country_id.disabled=false
        fields.institution_id.disabled=false
        fields.project_id.disabled=false

        fields.ill_cost_in_voucher.disabled=false
        ....
        ...
    }*/

    //enabled fields that can be edited only by admin/comm manager (disabled by default)
    if(auth.permissions.roles.includes("super-admin")|| auth.permissions.roles.includes("manager"))
    {
        fields.external.disabled=false 
        
        fields.institution_type_id.disabled=false
        fields.institution_country_id.disabled=false
        fields.institution_id.disabled=false

        fields.library_identifier_add.disabled = false
        fields.identifier_type_id.disabled=false
        fields.library_identifiers_txt.disabled=false
        fields.library_identifier_list.disabled=false
        fields.identifiers_id.disabled=false

        fields.project_id.disabled=false 
        
        //only if LIBRARY_DIFFERENT_PROFILES=true manager/admin can change profile type
        fields.profile_type.disabled=!enable_change_profile_type   
        
        fields.ill_supply_conditions.disabled=false
        fields.ill_imbalance.disabled=false
        fields.ill_cost.disabled=false
        fields.ill_user_cost.disabled=false
        fields.ill_IFLA_voucher.disabled=false
        fields.ill_cost_in_voucher.disabled=false
    }

    useEffect ( ()=>{

        if(!loading)
        if(library && library.id>0)
        {
            library.identifiers && library.identifiers.data && setListLength(library.identifiers.data.length)            
            setRequestData({
                ...library,
                'project_id': library.projects && library.projects.data? library.projects.data.map( ({id,name})=>{return id;}):null,
                'institution_type_id':  library.institution && library.institution.data?library.institution.data.institution_type_id:null,
                'institution_country_id':  library.institution && library.institution.data?library.institution.data.country_id:null               
            })
            fields.library_identifier_add.disabled = true

        }

    },[library])


    const AddNewIdentifier = (field_name,value,newList) => {
        fields.library_identifier_list.hidden = newList.length>0 ? false : true;
        //setData({...data, 'identifiers_id': newList})
        console.log("identifier_id" + JSON.stringify(newList))

    }

    const RemoveIdentifier = (field_name,value,newList) => {
        fields.library_identifier_list.hidden = newList.length>0 ? false : true;
        //setData({...data, 'identifier_id': newList})
        console.log(JSON.stringify(newList))
    }

   useEffect ( ()=>{
        if(identifierTypeSelected)
            fields.library_identifier_add.disabled = !identifierTypeSelected
        
    },[identifierTypeSelected])

    
    useEffect ( ()=>{
        if(identifierTypeSelected)
            fields.library_identifier_add.disabled = !identifierTypeSelected
        
    },[library])

    useEffect ( ()=>{
        fields.library_identifier_list.hidden = listLength>0 ? false : true;
    },[listLength])

    return (
            // <SimpleForm loading={loading}>
                 <CustomForm
                    submitCallBack={(formData) => submitFormAction(formData)}
                    //requestData={library ? library : null}                    
                    requestData={requestData}
                    fields={fields}
                    fieldsGroups={fieldsGroups}
                    title={library && library.name ? library.name : intl.formatMessage(messages.header)}                                        
                    country_id={countriesOptionList}             
                    institution_type_id = {institutionTypesOptionList}                    
                    institution_country_id = {countriesOptionList}
                    institution_id={institutionsByTypeCountryOptionList}        
                                    
                    
                    project_id={libraryProjectsOptionList}   
                    profile_type={profileTypeOptionList}                
                    
                    identifier_type_id = {identifiersOptionList}
                    AddNewIdentifier={AddNewIdentifier}
                    RemoveIdentifier={RemoveIdentifier}

                    subject_id={librarySubjectOptionList}                    
                    messages={{...messages, ...globalMessages}}                    
                    onChangeData={(field_name, value) => onChangeData(field_name, value)}
                      
                    //DISABLED userlist/grant permission
                    //searchOptionList={searches}
                    //usersOptionList={usersOptionList}
                    //granted_permissions={ library ? library.granted_permissions : [] }
                    //resources={resources}
                />            
            // </SimpleForm>
    )
}

export default MyLibraryForm
