import React from 'react';
import {Button} from 'reactstrap'
import './style.scss'
import LandingPageBox from '../LandingPageBox';

const LandingPagePatronBox = (props) => {
    const {auth,title,match,canCollapse,collapsed}=props

    const go = () => {
        alert("GO!!!")
    }
    
    return (      
                         
            <LandingPageBox iconClass="fa-solid fa-user" title={title} canCollapse={canCollapse} collapsed={collapsed} >
            <p>bla bla bla</p>                
            <div>join to library component (select a library from dropdown or preselected)
              <br/>
              ..... .... ... ....
              {match && match.path=='/user/join2lib/:library_id?' && match.params.library_id && match.params.library_id>0 &&            
                <>  
                  <b>PRE SELECTED Library ID passed: {match.params.library_id}</b>                                                           
                </>
              }
              ..... .... ... ....
              <br/>
              <button>join to library</button>                 
            </div>
            <br/>                        
            {auth.permissions.roles && auth.permissions.roles.includes("patron") &&  
                <>
                  <div>Belongings Libraries Component  (+ pending) </div>                  
                  <br/><br/>              
                  <button>Go To Reference Page</button>
                </>
              }
            </LandingPageBox>        
        
    )
}

export default LandingPagePatronBox;

              