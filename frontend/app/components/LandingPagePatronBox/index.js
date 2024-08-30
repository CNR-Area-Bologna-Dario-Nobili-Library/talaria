import React from 'react';
import { Button } from 'reactstrap';
import './style.scss';
import LandingPageBox from '../LandingPageBox';
import { Link } from 'react-router-dom';
import JointoLibPage from '../../containers/Patron/JointoLibPage';

const LandingPagePatronBox = props => {
  const { auth, title, match, history,canCollapse, collapsed } = props;     
    
  const fromOpenURLorPubmed=history && history.location && history.location.search.includes("byopenurl") 

  const go = () => {
    alert('GO!!!');
  };

  return (
    <LandingPageBox
      iconClass="fa-solid fa-user"
      title={title}
      canCollapse={canCollapse}
      collapsed={collapsed}
    >
      {/* <p>bla bla bla</p>       */}
      {match &&
        match.path === '/user/join2lib/:library_id?' &&
        match.params.library_id &&
        match.params.library_id > 0 && (
          <>
            <b>PRE SELECTED Library ID passed: {match.params.library_id}</b>
          </>
        )}
      <JointoLibPage {...props} /> {/* Include JointoLibPage here */}
      <br />      
      {auth.permissions.roles && auth.permissions.roles.includes("patron") &&  
        <div className="row">
          <div className="col-md-6">          
            {fromOpenURLorPubmed && <Link className="btn btn-sm btn-success btn-block" to={'/patron/references/new'+(history.location.search?history.location.search:'')}>Import from openurl/pmid</Link>
            // ||
            // <Link className="btn btn-sm btn-success btn-block" to={'/patron/references/new'}>Go to reference manager</Link>
            
            }                            
          </div>                  
        </div>
      }
    </LandingPageBox>
  );
};

export default LandingPagePatronBox;
