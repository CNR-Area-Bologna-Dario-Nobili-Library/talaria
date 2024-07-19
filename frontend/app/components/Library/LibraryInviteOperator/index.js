import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import Select, { components } from 'react-select';
import './style.scss'; 
import confirm from 'reactstrap-confirm';

import LibraryInviteOperatorForm from '../LibraryInviteOperatorForm';

const LibraryInviteOperator = props => {
  const { usersData, searchUserCallback, inviteOpCallback, auth } = props;
  const intl = useIntl();

  const [selectedUser, setSelectedUser] = useState(null);
  const [usersOptions, setUsersOptions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showAddUserManuallyLink, setShowAddUserManuallyLink] = useState(false);
  const [hasShownAddUserLinkBefore, setHasShownAddUserLinkBefore] = useState(
    false,
  );
  const [name, setName] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [isManualEntry, setIsManualEntry] = useState(false);

  const formStyles = {
    display: showForm ? 'block' : 'none',
  };

  useEffect(() => {
    if (usersData) {
      const filteredData = usersData.filter(p => p.email !== auth.user.email);

      if (filteredData.length > 0) {
        setUsersOptions(
          filteredData.map(u => ({
            label: `${u.name} ${u.surname} (${u.email})`,
            value: u,
          })),
        );
        setShowAddUserManuallyLink(false); // Hide link if there are users found
      } else {
        setUsersOptions([]);
        if (!hasShownAddUserLinkBefore) {
          setShowAddUserManuallyLink(false); // Hide link for the first time
          setHasShownAddUserLinkBefore(true); 
        } else {
          setShowAddUserManuallyLink(true); 
        }
      }
    }
  }, [usersData, auth.user.email, hasShownAddUserLinkBefore]);

  const resetSearchResults = () => {
    setUsersOptions([]);
    setSelectedUser(null);
    setShowForm(false);
    setShowAddUserManuallyLink(false);
    setName('');
    setFullName('');
    setEmail('');
    setIsManualEntry(false);
  };

  const onSearchInputChange = (query, e) => {
    if (e.action === 'clear') {
      resetSearchResults();
    } else if (e.action === 'input-change') {
      setShowForm(false);
      setShowAddUserManuallyLink(false);
      setName('');
      setFullName('');
      setEmail('');
      setIsManualEntry(false);
      if (query.length >= 3) {
        searchUserCallback(query);
      }
    }
  };

  const onSearchSelectChange = (val, typeaction) => {
    if (typeaction.action === 'clear') {
      resetSearchResults();
    } else if (typeaction.action === 'select-option') {
      setSelectedUser(val.value);
      setShowForm(true);
      setShowAddUserManuallyLink(false);
      setIsManualEntry(false);
    }
  };

  const handleAddUserManuallyClick = () => {
    resetSearchResults();
    setShowForm(true);
    setIsManualEntry(true);
  };

  async function inviteUser(opdata) {
    let msg = intl.formatMessage({
      id: 'app.components.LibraryInviteOperator.askInviteOperatorMessage',
    });

    let conf = await confirm({
      title: intl.formatMessage({ id: 'app.global.confirm' }),
      message: msg,
      confirmText: intl.formatMessage({ id: 'app.global.yes' }),
      cancelText: intl.formatMessage({ id: 'app.global.no' }),
    });

    if (conf) {
      resetSearchResults();
      inviteOpCallback(opdata);
    }
  }

  // Custom MenuList component to include the Add User Manually link
  const MenuList = props => {
    return (
      <components.MenuList {...props}>
        {props.children}
        {showAddUserManuallyLink && (
          <div
            className="add-user-link"
            style={{ padding: '10px', cursor: 'pointer', textAlign: 'center' }}
          >
            No user found,&nbsp;
            <a
              href="#"
              onClick={e => {
                e.preventDefault();
                handleAddUserManuallyClick();
              }}
              style={{ color: 'blue', textDecoration: 'underline' }} 
            >
              Click here
            </a>
            &nbsp;to invite user manually
          </div>
        )}
      </components.MenuList>
    );
  };

  return (
    <div className="container">
      <div className="row mt-2">
        <div className="col col-md-8">
          <div className="invite-box">
            <h2>Invite user</h2>
            <p>Search for user by name, surname or email address.</p>
            <p>
              If a user is found then assign permissions and invite your
              colleague!
            </p>
            <p>
              If a user is not found fill the form with name, surname and email,
              add permissions and invite!
            </p>

            <Select
              id="searchuserSelect"
              options={usersOptions}
              onInputChange={onSearchInputChange}
              onChange={onSearchSelectChange}
              className=""
              isClearable={true}
              isSearchable={true}
              closeMenuOnSelect={true}
              onSelectResetsInput={false}
              hideSelectedOptions={false}
              placeholder={
                'Search for a user filling his name, surname or email'
              }
              components={{ MenuList }}
            />
          </div>
        </div>
      </div>

      <div className="row mt-2" style={formStyles}>
        <div className="col col-md-8">
          <LibraryInviteOperatorForm
            auth={auth}
            submitCallback={inviteUser}
            userData={selectedUser}
            name={name}
            setName={setName}
            fullName={fullName}
            setFullName={setFullName}
            email={email}
            setEmail={setEmail}
            isManualEntry={isManualEntry}
          />
        </div>
      </div>
    </div>
    
  );
};

export default LibraryInviteOperator;
