import React from 'react';
import { Button } from 'reactstrap';
import './style.scss';
import LandingPageBox from '../LandingPageBox';
import JointoLibPage from '../../containers/Patron/JointoLibPage';

const LandingPagePatronBox = props => {
  const { auth, title, match, canCollapse, collapsed } = props;

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
      {auth.permissions.roles && auth.permissions.roles.includes('patron') && (
        <>
          {/* <div>Belongings Libraries Component (+ pending) </div>
          <br /><br /> */}
          {/* <button onClick={go}>Go To Reference Page</button> */}
        </>
      )}
    </LandingPageBox>
  );
};

export default LandingPagePatronBox;
