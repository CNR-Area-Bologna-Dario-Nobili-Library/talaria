import React from 'react';
import {Button} from 'reactstrap'
import './style.scss'
import LandingPageBox from '../LandingPageBox';
import { Link } from 'react-router-dom';

const LandingPageLibrariesBox = (props) => {
    const {auth,title,match,history,canCollapse,collapsed}=props

    const fromOpenURLorPubmed=history && history.location && history.location.search.includes("byopenurl") 

    console.log("LandingPageLibrariesBox",props)

    const badgeType = (p) => {
        let ty="badge-info";

        switch (p) {
          case 'manage': ty="badge-danger"; break;          
          case 'borrow':
          case 'ill-borrow': ty="badge-primary"; break;          
          case 'lend': 
          case 'ill-lend': ty="badge-secondary"; break;
          case 'deliver': ty="badge-info"; break;
          case 'manage-users': ty="badge-light"; break;
          case 'manage-licenses': ty="badge-dark"; break;       
        }

        return ty;
    }
    
    return (      
                        
            <LandingPageBox iconClass="fa-solid fa-landmark" title={title} canCollapse={canCollapse} collapsed={collapsed} >
            <p>bla bla bla</p>                                      
            <>
                  {auth.permissions.resources.libraries && auth.permissions.resources.libraries.length>=1 && 
                  <div>                      
                      <h3>Current permissions</h3>
                      { auth.permissions.resources.libraries.map((res,i)=> (
                        <div className="permissionsBox" key={`row-${res.resource.id}`}>                            
                            <span>{res.resource.name}</span>
                            <span>{res.permissions.map((p,i)=>(
                              <span key={"badge_perm_"+i} className={"badge "+badgeType(p)}>{p}</span>
                            ))}</span> 

                            <Link className="btn btn-sm btn-primary" to={'/library/'+res.resource.id} key={'lib'+res.resource.id}>GO!</Link>                             
                            &nbsp;                            
                            { (res.permissions.includes("borrow")||res.permissions.includes("manage") ) && 
                            (
                              fromOpenURLorPubmed && (<Link className="btn btn-sm btn-success" to={'/library/'+res.resource.id+"/borrowing/new"+(history.location.search?history.location.search:'')} key={'openurllink'+res.resource.id}>Import from Openurl/Pubmed</Link>) 
                              ||<Link className="btn btn-sm btn-info" to={'/library/'+res.resource.id+"/borrowing/new"} key={'borrlink'+res.resource.id}>New request</Link>                                                                                    
                            )}                            
                        </div>)
                    )}
                  </div>                    
                  }
                  {/*match && match.path=='/user/work4lib/:library_id?' && match.params.library_id && match.params.library_id>0 && /* or pending requests */  
                  <div>
                      <h3>Pending operators requests (matching email address or DB data)</h3>
                      bla bla bla ....
                  </div>                    
                  }                            
                  <br/><br/>
                  Are you a librarian and want to register a new library into the system?
                  <br/>
                  <Link className="btn btn-sm btn-primary" to={'/register-library/'}>Register your library</Link>       
                
            </>                                                      
            </LandingPageBox>        
        
    )
}

export default LandingPageLibrariesBox;
