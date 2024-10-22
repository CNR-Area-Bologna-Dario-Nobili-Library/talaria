import React from 'react';
import { Link } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { permissionBadgeClass } from '../../utils/utilityFunctions.js';

const Operator = (props) => {
  const { data, editPath, deleteOpCallback, enableEdit, enableDelete } = props;

  const name = data.name;
  const surname = data.surname;
  const email = data.email;
  const full_name = data.full_name;

  const intl = useIntl();

  return (
    <div className="div-table-row">
      <div className="div-table-cell" style={{ width: '25%' }}>
        {name} {surname} ({full_name}) {email}
      </div>
      <div className="div-table-cell" style={{ width: '55%' }}>
        {data.permissions &&
          data.permissions.map((p, i) => (
            <span key={'badge_temp_perm_' + i} className={'badge ' + permissionBadgeClass(p)}>
              {p}
            </span>
          ))}
      </div>
      <div className="div-table-cell" style={{ width: '20%' }}>
        {enableEdit && editPath && (
          <Link className="btn btn-sm btn-info me-2" to={editPath} key={'editbutton'}>
            <i class="fa-solid fa-pencil"></i>
          </Link>
        )}
        {enableDelete && deleteOpCallback && (
          <button className="btn btn-sm btn-danger" onClick={deleteOpCallback} key={'deletebutton'}>
            <i class="fa-solid fa-trash"></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default Operator;