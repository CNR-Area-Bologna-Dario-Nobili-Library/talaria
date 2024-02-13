/**
 *
 * LandingPage
 *
 */
import React, { useState,useEffect } from 'react';
import {useIntl} from 'react-intl';

import RegisterLibrary from '../RegisterLibrary'
import MyLibraryPage from '../Patron/MyLibraryPage'
import { NavLink } from 'react-router-dom';
import LandingPageAdminBox from '../../components/LandingPageAdminBox';
import LandingPageInstitutionsBox from '../../components/LandingPageInstitutionsBox';
import LandingPageProjectsBox from '../../components/LandingPageProjectsBox';
import LandingPageConsortiaBox from '../../components/LandingPageConsortiaBox';
import LandingPageLibrariesBox from '../../components/LandingPageLibrariesBox';
import LandingPagePatronBox from '../../components/LandingPagePatronBox';


function LandingPage(props) {
  console.log("LandingPage:",props)

  const patrons_enabled=(process.env.MANAGE_PATRONS && process.env.MANAGE_PATRONS=="true")?true:false;

  const {match,history}=props

  const intl=useIntl();  
 
  /*const [PatronReg,setPatronReg]=useState (true);
  const togglePatronReg = () => {setPatronReg(true); setLibraryReg(false);}
  const [LibraryReg,setLibraryReg]=useState (false);
  const toggleLibraryReg = () => {setLibraryReg(true); setPatronReg(false);}  

  useEffect(() => {
  if(patrons_enabled)
    togglePatronReg()
  else toggleLibraryReg()
    
  }, [patrons_enabled])*/

  return (                      
        /*(props.auth.permissions.roles && props.auth.permissions.roles.includes("registered") && 
          (!props.auth.permissions.resources || props.auth.permissions.resources.length==0) 
          && 
       <>       
       <p>{intl.formatMessage({id:'app.containers.LandingPage.intro'})}</p>       
       <p>{intl.formatMessage({id:'app.containers.LandingPage.intro_library'})}</p>       
       {patrons_enabled && 
        <p>{intl.formatMessage({id:'app.containers.LandingPage.intro_patron'})}</p>
       }
       <nav>
       {patrons_enabled && <NavLink
              className="btn btn-primary mx-3"
              key="associateLib"                                            
              isActive={()=>PatronReg}         
              onClick={(e)=>togglePatronReg()}      
              to="#"        
        >{intl.formatMessage({id:'app.global.patron'})}</NavLink>}
        <NavLink
              className="btn btn-primary mx-3"
              key="registernewlibrary"                                          
              isActive={()=>LibraryReg}        
              to="#"        
              onClick={(e)=>toggleLibraryReg()}            
        >{intl.formatMessage({id:'app.global.librarian'})}</NavLink>           
        </nav>
        <div className="card-form card">
          {(patrons_enabled && PatronReg) && <MyLibraryPage match={match} auth={props.auth}/>}
          {LibraryReg && <RegisterLibrary {...props.auth}/> }  
        </div>
        </>
       ||
       <>       
       <p>You've multiple roles, please choose one from below</p>
        Roles List:
        <ul>
          <li>Role 1</li>
          <li>Role 2</li>
          <li>Role 3</li>
        </ul>
      </>)
    */    
   <>
   <h1>User dashboard / Landing Page</h1>
      <div className="container">
        {(props.auth.permissions.roles.length==1 && props.auth.permissions.roles.includes("registered") )&& Object.keys(props.auth.permissions.resources).length==0 &&
           <div>just registered</div>
        }
        {(props.auth.permissions.roles.length>=1 && props.auth.permissions.roles.includes("patron") ) && 
        <div>Patron</div>
        }
        <br/>
        {(props.auth.permissions.roles.length==0)&& 
           <div>NO ROLES</div>
        }
        <br/>         
        {(props.auth.permissions.roles.length>=1)&& 
           <div>ONE/MANY ROLES (including "registered") </div>
        }
        <br/>
        {props.auth.permissions.resources.libraries && props.auth.permissions.resources.libraries.length>=1 && 
           <div>ONE/MANY LIBRARIES</div>
        }       
        {props.auth.permissions.resources.institutions && props.auth.permissions.resources.institutions.length>=1 && 
           <div>ONE/MANY INSTITUTIONS</div>
        }               
        <hr/>
        <div className='landingBoxes d-flex flex-row justify-content-start flex-wrap'>          
          <LandingPagePatronBox history={history} title="Patron Box" auth={props.auth} match={props.match}/>
          <LandingPageLibrariesBox history={history} title="Libraries Box" auth={props.auth} match={props.match}/>          
          <LandingPageInstitutionsBox history={history} title="Institutions Box" auth={props.auth} match={props.match}/>
          <LandingPageProjectsBox history={history} title="Projects Box" auth={props.auth} match={props.match}/>
          <LandingPageConsortiaBox history={history} title="Consortia Box" auth={props.auth} match={props.match}/>
          <LandingPageAdminBox history={history} title="Administration Box" auth={props.auth} match={props.match}/>                  
        </div>
      
      </div>    
    </>
  );
}


export default LandingPage;
