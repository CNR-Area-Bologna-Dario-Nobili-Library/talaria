import React from 'react';
import {Button} from 'reactstrap'
import './style.scss'
import LandingPageBox from '../LandingPageBox';

const LandingPageLibrariesBox = (props) => {
    const {auth,title,match,canCollapse,collapsed}=props

    const go = () => {
        alert("GO!!!")
    }
    
    return (      
                        
            <LandingPageBox iconClass="fa-solid fa-landmark" title={title} canCollapse={canCollapse} collapsed={collapsed} >
            <p>bla bla bla</p>                
            {auth.permissions.resources.libraries && auth.permissions.resources.libraries.length>=1 && /* or pending requests */       
                <div>Current Libraries permissions Component + pending </div>                    
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
