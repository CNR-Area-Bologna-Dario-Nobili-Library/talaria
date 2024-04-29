import React, { useEffect, useState } from 'react';
import { Button } from 'reactstrap';
import { useIntl } from 'react-intl';
import './style.scss';
import messages from './messages';
import { Link } from 'react-router-dom';

import { permissionBadgeClass } from '../../utils/utilityFunctions.js';
import { formatDateTime } from '../../utils/dates.js';

const PendingOperator = props => {
  const {
    data,
    deleteOpCallback,
    enableDelete,
    acceptOpCallback,
    rejectOpCallback,
    auth,
  } = props;

  const user_name = data.user ? data.user.data.name : data.user_name;
  const user_surname = data.user ? data.user.data.surname : data.user_surname;
  const user_email = data.user ? data.user.data.email : data.user_email;
  const status = data.status;

  const intl = useIntl();

  console.log('PendingOperator', props);

  const pendingStatusClass = status => {
    switch (status) {
      case 0:
        return 'pending';
        break;
      // case 1: return 'success'; break;
      case 2:
        return 'disabled';
        break;
    }
    return status;
  };

  return (
    <div className="container" style={{ marginTop: '30px' }}>
      <div className="div-table-row">
        <div className="div-table-cell" style={{ width: '25%' }}>
          {user_name} {user_surname} ({user_email})
        </div>
        <div className="div-table-cell" style={{ width: '19%' }}>
          {data.abilities &&
            data.abilities.split(',').map((ability, index) => (
              <span
                key={'badge_temp_perm_' + index}
                className={'badge ' + permissionBadgeClass(ability)}
              >
                {ability}
              </span>
            ))}
        </div>
        <div className="div-table-cell" style={{ width: '10%' }}>
          <div className={`status-point ${pendingStatusClass(status)}`} />
        </div>
        <div className="div-table-cell" style={{ width: '13%' }}>
          {formatDateTime(data.created_at)}
        </div>
        <div className="div-table-cell" style={{ width: '13%' }}>
          {formatDateTime(data.updated_at)}
        </div>
        <div className="div-table-cell" style={{ width: '20%' }}>
          {(user_email === auth.user.email || data.id === auth.user.id) && (
            <div className="div-actions">
              {acceptOpCallback && (
                <a
                  className="btn btn-sm btn-success"
                  onClick={() => acceptOpCallback()}
                  key={'acceptbutton'}
                >
                  {intl.formatMessage({ id: 'app.global.accept' })}
                </a>
              )}
              {rejectOpCallback && (
                <a
                  className="btn btn-sm btn-danger"
                  onClick={() => rejectOpCallback()}
                  key={'rejectbutton'}
                >
                  {intl.formatMessage({ id: 'app.global.reject' })}
                </a>
              )}
            </div>
          )}
          {/* {acceptOpCallback && rejectOpCallback && (
            <div className="divider-line" />
          )} */}
          {enableDelete && deleteOpCallback && (
            <div
              className="delete-button"
              style={{ textAlign: 'center', width: '100%' }}
            >
              <a
                className="btn btn-sm btn-secondary text-black"
                onClick={() => deleteOpCallback()}
                key={'deletebutton'}
              >
                {intl.formatMessage({ id: 'app.global.delete' })}
              </a>
            </div>
          )}{' '}
        </div>
      </div>
    </div>
  );
};

export default PendingOperator;
