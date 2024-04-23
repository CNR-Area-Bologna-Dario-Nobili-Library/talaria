import React, {useEffect, useState} from 'react'
import {useIntl} from 'react-intl';
import Select from 'react-select';
import './style.scss';
import confirm from "reactstrap-confirm";

import LibraryInviteOperatorForm from '../LibraryInviteOperatorForm';

const LibraryInviteOperator = (props) => {
    const {usersData,searchUserCallback, inviteOpCallback} = props
    console.log('InviteOperator', props)
             
    const intl = useIntl()

    async function  inviteUser (opdata) {
      
        let msg=intl.formatMessage({id: "app.components.LibraryInviteOperator.askInviteOperatorMessage"})
        
        
        let conf = await confirm({
            title: intl.formatMessage({id: 'app.global.confirm'}),
             message: msg,
             confirmText: intl.formatMessage({id: 'app.global.yes'}),
             cancelText: intl.formatMessage({id: 'app.global.no'})
         }); 
       

        if(conf)
        {
          resetSearchResults()
          inviteOpCallback(opdata)
        }
           
                        

    }     

    const [selectedUser,setSelectedUser]=useState(null);
    const [usersOptions,setUsersOptions]=useState([]);    
    

    useEffect(() => {      
          setUsersOptions(usersData.map(u=>{              
              let nameparts=[u.name,u.surname,u.full_name]
              let name=nameparts.join(',')+" ("+u.email+")"
              return {'label':name, 'value':u}
            }
          ))          
    }, [usersData])

  const resetSearchResults=()=>{
    setUsersOptions([])
    setSelectedUser({})    
  }  

  //triggered when type something in the textbox/clear the text manually
  const onSearchInputChange=(query,e)=> {    
    console.log("input-change",e)   
    
    if(e.action==='clear')
      resetSearchResults()      
    else         
    if(e.action==='input-change' && query!="" && query.length>=3)
      searchUserCallback(query)                  
  }

  //triggered when choosed an option from select  or clear (by "x" button)
  const onSearchSelectChange = (val,typeaction) => {    
    console.log("onSearchSelectChange",val,typeaction)
    if(typeaction.action==='clear')
      resetSearchResults()      
    else
     if(typeaction.action==='select-option')
      setSelectedUser(val.value)    
  }
    
    

    return (
      <div className="container">
        <div className="row mt-2">
          <div className="col col-md-8">
            <h4>Invite user</h4>
            <p>Search for it or fill the form below and invite!</p>
            <Select id="searchuserSelect"
                      options={usersOptions}
                      onInputChange={onSearchInputChange}                               
                      onChange={onSearchSelectChange}                  
                      className=""                                                                           
                      isClearable={true}                  
                      isSearchable={true}                  
                      closeMenuOnSelect={true}   
                      onSelectResetsInput={false}         
                      hideSelectedOptions={false}    
                      placeholder={"Search for a user filling his name/surname/email/"}                                               
            />               
          </div>
        </div>
        <div className="row mt-2">         
          <div className="col col-md-8">
            <LibraryInviteOperatorForm submitCallback={(opdata)=>inviteUser(opdata)} userData={selectedUser}/>
          </div>
        </div>         
        
      </div>
    )
} 

export default LibraryInviteOperator