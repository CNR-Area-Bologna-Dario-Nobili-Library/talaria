/**
 *
 * OpenURLResolver
 *
 questo componente accetta byopenurl=true|false + param openurl
 e ridirige sempre a /patron/references/new oppure library/xxx/borrowing/new ...
 e ovviamente queste pagine faranno parsing openurl + nuovo form
 
 
 */

 
 

import React, {useEffect,useState} from 'react';
import { withRouter} from 'react-router-dom';

import { compose } from 'redux';
import {Redirect} from 'react-router-dom'
import resourcesMap from '../../routes/resources';
import {checkRole} from '../../utils/permissions'

 
export function ImportReference(props) {
  console.log("ImportReference:",props)  

  let querystring=(props.history.location.search)? props.history.location.search:null

  console.log("Import params",querystring);

  let byopenurl=props.byOpenURL?"&byopenurl=1":"";

  if(byopenurl!="" && querystring!=null) 
    querystring+=byopenurl
  
  //let newurl=null;

  const [redirUrl,setRedirUrl]=useState(null)

  const [mounted,setMounted]=useState(false);

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {    

   let newurl="/user/dashboard"

  //it comes from /newreference or /openurl?xxxx and we want to go in the component specific for
  //the user depending on his roles (so in /patron/references or in library/<libid>/borrowing/)  
  //in order to allow it to IMPORT/create new reference/request
  if(props.isLogged /*&& querystring!=null*/)
  {        
    //he's a patron
    if( (!props.auth.permissions.resources || props.auth.permissions.resources.length==0) && (props.auth.permissions.roles && props.auth.permissions.roles.length==2 && checkRole(props.auth,"patron")) ) 
        newurl="/patron/references/new"+(querystring?querystring:'')        
    else //if he is an operator and has only one library => try to import openurl in this library's borrowing
    if (props.auth.permissions.resources && (Object.keys(props.auth.permissions.resources).length==1) && (props.auth.permissions.resources.libraries && props.auth.permissions.resources.libraries.length==1))    
    {                      
            let res="libraries";
            let resid=props.auth.permissions.resources.libraries[0].resource.id;   
            let canBorrow=props.auth.permissions.resources.libraries[0].permissions.includes("borrow")||props.auth.permissions.resources.libraries[0].permissions.includes("manage")

            //can borrow on this library
            if(canBorrow)
              newurl=resourcesMap[res]+resid+"/borrowing/new"+(querystring?querystring:'');               
    }    
    else {
      //in case of multiple roles/resources or multiple institutions or multiple libraries will be redirected to landing page
    }    
    setRedirUrl(newurl)
  
   }         
  }, [props.isLogged])


  //main
  return (
    <>
    {mounted && props.isLogged /*&& querystring!=null*/ && redirUrl!=null && <Redirect to={redirUrl}/>}  
    </>
  )
    
}

export default compose(withRouter)(ImportReference);
