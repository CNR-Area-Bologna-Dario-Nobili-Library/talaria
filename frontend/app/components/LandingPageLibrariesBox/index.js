import React from 'react';
import {Button} from 'reactstrap'
import './style.scss'
import LandingPageBox from '../LandingPageBox';
import { Link } from 'react-router-dom';

const LandingPageLibrariesBox = (props) => {
    const {auth,title,match,canCollapse,collapsed}=props

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
            {auth.permissions.resources.libraries && auth.permissions.resources.libraries.length>=1 && /* or pending requests */       
                <>
                  <div>
                      <h3>Current permissions</h3>
                      { auth.permissions.resources.libraries.map((res,i)=> (
                        <div className="permissionsBox" key={`row-${res.resource.id}`}>                            
                            <span>{res.resource.name}</span>
                            <span>{res.permissions.map((p,i)=>(
                              <span className={"badge "+badgeType(p)}>{p}</span>
                            ))}</span> 
                            <Link className="btn btn-sm btn-primary" to={'/library/'+res.resource.id} key={'lib'+res.resource.id}>GO!</Link> 
                        </div>)
                    )}
                  </div>                    
                  <div>
                      <h3>Pending operators requests</h3>
                      bla bla bla ....
                  </div>                    
                </>
            }

            {match && match.path=='/user/work4lib/:library_id?' && match.params.library_id && match.params.library_id>0 &&
              <>
                <b>Want to be operator of the Library ID: {match.params.library_id} ?</b>
                <button>ACCEPT/DENY</button>
              </>
            } 
            
                <br/><br/>
                <button>Register library</button>            

            </LandingPageBox>        
        
    )
}

export default LandingPageLibrariesBox;
