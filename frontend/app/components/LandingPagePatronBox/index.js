import React from 'react';
import { Button } from 'reactstrap';
import './style.scss';
import LandingPageBox from '../LandingPageBox';
import { Link } from 'react-router-dom';
import JointoLibPage from '../../containers/Patron/JointoLibPage';
import { useIntl } from 'react-intl';
import BelongingLibraries from '../../containers/Patron/BelongingLibraries/';

const LandingPagePatronBox = props => {
  const { auth, title, match, history, canCollapse, collapsed, patron } = props;

  const intl = useIntl();

  const fromOpenURLorPubmed =
    history &&
    history.location &&
    history.location.search.includes('byopenurl');


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
      {/* check LIBRARY ID PASSED BY URL

      match &&
        match.path === '/user/join2lib/:library_id?' &&
        match.params.library_id &&
        match.params.library_id > 0 && (
          <>
            <b>PRE SELECTED Library ID passed: {match.params.library_id}</b>
          </>
        )}
      */}    
      <JointoLibPage {...props} /> 
      {/* Include JointoLibPage here */}
      {/* <div className="box p-3 mb-3 text-center">
        <button
          className="btn btn-success mt-2"
          onClick={() => history.push('/patron/references/new')}
          style={{ width: '200px' }}
        >
          {intl.formatMessage(messages.buttonReferenceManager)}
          reference
        </button>
      </div> */}
      {/* {patron.my_libraries.data.length > 0 && (
        <BelongingLibraries {...props} />
          librariesList={patron.my_libraries.data}
          gridtitleiconLink="/patron/my-libraries"
          history={history}
          dispatch={dispatch}
          showeditbutton={true}
        />
      )} */}
      {/* <center>
        <button
          className="btn btn-secondary mt-3"
          style={{ width: '200px' }}
          onClick={() => history.push('/patron/my-libraries')}
        >
          {intl.formatMessage(messages.manageYourLibraries)}
          manage
        </button>
        <button
          className="btn btn-primary mt-3 ml-5"
          style={{ width: '200px' }}
          onClick={() => history.push('/patron/my-libraries/new')}
          //onClick={() => setShowForm(true)}
        >
          {intl.formatMessage(messages.joinNewLibrary)}
          join
        </button>
      </center> */}
      <br />
      {auth.permissions.roles && auth.permissions.roles.includes('patron') && (
        <div className="row">
          <div className="col-md-6">
            {fromOpenURLorPubmed && (
              <Link
                className="btn btn-sm btn-success btn-block"
                to={
                  '/patron/references/new' +
                  (history.location.search ? history.location.search : '')
                }
              >
                {intl.formatMessage({id:'app.components.LandingPagePatronBox.importFromOpenurlButton'})}
              </Link>
            )
            // ||
            // <Link className="btn btn-sm btn-success btn-block" to={'/patron/references/new'}>Go to reference manager</Link>
            }
          </div>
        </div>
      )}
    </LandingPageBox>
  );
};

export default LandingPagePatronBox;
