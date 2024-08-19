/*
 * Library Page
 *
 *
 *
 */

import React, {useEffect,useState} from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {useIntl} from 'react-intl';
import messages from './messages';

import {requestUpdateLibrary,requestGetLibrary,requestPostLibrary,requestGetCountriesOptionList,requestLibrarySubjectOptionList,requestGetlibraryProjectsOptionList,requestLibraryIdentifierTypesOptionList,
  requestGetInstitutionsOptionList,requestGetInstitutionTypesOptionList,requestGetInstitutionsByTypeByCountryOptionList} from '../actions';

import makeSelectLibrary,{isLibraryLoading,countriesOptionListSelector, librarySubjectOptionListSelector,institutionsOptionListSelector,institutionTypesOptionListSelector,institutionsByTypeCountryOptionListSelector,libraryProjectsOptionListSelector,identifiersOptionListSelector} from '../selectors';
import {MyLibraryForm, Loader} from 'components';

function ManageLibraryPage(props) {
    const intl = useIntl();
    const {isLoading, dispatch, data,match,countriesOptionList,institutionTypesOptionList,libraryProjectsOptionList,librarySubjectOptionList,institutionsOptionList,institutionsByTypeCountryOptionList,libraryIdentifierTypesOptionList,auth} = props
    const {params} = match
    const isNew = !params.library_id || params.library_id === 'new'
    const library = data.library
    // const libraryOptionList = patron.libraryOptionList    

    //const [projectsIds,setProjectsIds]=useState(null)
    const [instype,setInstitutiontypeid]=useState(null)
    const [instcountry,setInstitutionCountryid]=useState(null)
    const [identifierTypeSelected, setidentifierTypeSelected] = useState(false);

    useEffect(() => {
      if(!isLoading){
        if(!isNew) {
          dispatch(requestGetLibrary(params.library_id))
        }
        dispatch(requestGetCountriesOptionList())        
        dispatch(requestGetInstitutionsOptionList())
        dispatch(requestGetInstitutionTypesOptionList())
        dispatch(requestLibrarySubjectOptionList())
        dispatch(requestGetlibraryProjectsOptionList())
        dispatch(requestLibraryIdentifierTypesOptionList())  
      }
     }, [])

     useEffect(()=>{
      if(!isLoading) 
        if(library && library.id>0) {  
          setInstitutiontypeid(library.institution.data.institution_type_id);        
          setInstitutionCountryid(library.institution.data.country_id);                
        }            
   },[library])

     useEffect(()=>{
      if(!isLoading) 
          dispatch(requestGetInstitutionsByTypeByCountryOptionList(null,instcountry,instype));                   
      },[instype,instcountry])

     const onChangeData = (field_name, value) => {
            
      if (field_name === "institution_type_id")
          setInstitutiontypeid(value.value);                     
      
      if (field_name === "institution_country_id")
          setInstitutionCountryid(value.value);                         
             
       if (field_name === "identifier_type_id" && value!==0)
         setidentifierTypeSelected(true)
       else
         setidentifierTypeSelected(false)
       
  }


    return (
      <Loader show={isLoading}>
          <MyLibraryForm
            auth={auth}
            library={!isNew ? library : null}
            loading={isLoading}
            institutionsOptionList={institutionsOptionList}
            institutionsByTypeCountryOptionList={institutionsByTypeCountryOptionList}
            countriesOptionList={countriesOptionList}
            librarySubjectOptionList={librarySubjectOptionList}
            institutionTypesOptionList={institutionTypesOptionList}            
            libraryProjectsOptionList={libraryProjectsOptionList}            
            identifiersOptionList={libraryIdentifierTypesOptionList}
            identifierTypeSelected={identifierTypeSelected}
            searches={{                           
              country_id: (input) => dispatch(requestGetCountriesOptionList(input)),
              subject_id: (input) => dispatch(requestLibrarySubjectOptionList(input)),
              institution_type_id: (input) => dispatch(requestGetInstitutionTypesOptionList(input)),   
              institution_country_id: (input) => dispatch(requestGetCountriesOptionList(input)),                                 
            }}
            //resources={data.resources.libraries}
            titleNewLibrary={isNew ? intl.formatMessage(messages.titleNewLibrary) : ""}
            submitFormAction={
                !isNew ? (formData) => dispatch(requestUpdateLibrary({...formData, id: params.library_id}, intl.formatMessage(messages.updateMessage)))
                : (formData) => dispatch(requestPostLibrary(formData, intl.formatMessage(messages.createMessage)))
              }
            onChangeData={onChangeData}    
          />
      </Loader>
    );
  }


  const mapStateToProps = createStructuredSelector({
    isLoading: isLibraryLoading(),
    data: makeSelectLibrary(),
    countriesOptionList: countriesOptionListSelector(),
    librarySubjectOptionList: librarySubjectOptionListSelector(),
    libraryProjectsOptionList: libraryProjectsOptionListSelector(),
    institutionsOptionList: institutionsOptionListSelector(),
    institutionTypesOptionList: institutionTypesOptionListSelector(),
    institutionsByTypeCountryOptionList:institutionsByTypeCountryOptionListSelector(),
    libraryIdentifierTypesOptionList:identifiersOptionListSelector(),
  });

  function mapDispatchToProps(dispatch) {
    return {
      dispatch,
    };
  }

  const withConnect = connect(
    mapStateToProps,
    mapDispatchToProps,
  );

  export default compose(withConnect)(ManageLibraryPage);
