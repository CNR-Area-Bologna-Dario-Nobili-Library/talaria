import React from 'react';
import {Button} from 'reactstrap'
import './style.scss'
import LandingPageBox from '../LandingPageBox';
import { Link } from 'react-router-dom';

const LandingPagePatronBox = (props) => {
    const {auth,title,match,history,canCollapse,collapsed}=props
    
    const fromOpenURLorPubmed=history && history.location && history.location.search.includes("byopenurl") 
    
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
                  &nbsp;
                  {fromOpenURLorPubmed && <Link className="btn btn-sm btn-success" to={'/patron/references/new'+(history.location.search?history.location.search:'')}>Import from openurl</Link>
                  ||<Link className="btn btn-sm btn-info" to={'/patron/references/new'}>New reference</Link>}                            
                </>
              }
            </LandingPageBox>        
        
    )
}

export default LandingPagePatronBox;

              