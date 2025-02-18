import React from 'react';
import { NavLink } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { Row, Col } from 'reactstrap';
import { generatePath } from 'react-router';

import './style.scss';

const MyLibraryItem = props => {
  const { data, editPath, setPreferred, preferred, deleteCallback } = props;
  const intl = useIntl();

  const editurl = (library_id, id) => {
    return generatePath(`${editPath}`, { library_id, id });
  };

  const statusClass = status => {
    switch (status) {
      case 0:
        return 'disabled';
      case 1:
        return 'success';
      case 2:
        return 'pending';
      default:
        return '';
    }
  };

  const preferredStarClass = pref => {
    return pref ? 'preferred' : 'notpreferred';
  };

  return (
    <Row className="list-row my-libraries-item justify-content-between align-items-center mb-3 p-2 border rounded">
      {/* Left section: Preferred star, status indicator, and date */}
      <Col xs={12} md={3} className="d-flex align-items-center mb-2 mb-md-0">
        {data.status === 1 && (
          <a onClick={setPreferred}>
            <i
              className={`fa-solid fa-star preferred-star ${preferredStarClass(
                data.id === preferred,
              )}`}
            />
          </a>
        )}
        <div className="status-block ml-3">
          <div className={`status-point ${statusClass(data.status)}`} />
        </div>
        <div className="ml-3">
          {data.created_at && (
            <p className="mb-0">
              {new Date(data.created_at).toLocaleDateString()}
            </p>
          )}
        </div>
      </Col>

      {/* Middle section: Name and label */}
      <Col xs={12} md={4} className="info mb-2 mb-md-0">
        <h5 className="mb-1">{data.name}</h5>
        {data.label && <small className="text-muted">({data.label})</small>}
      </Col>

      {/* Additional info */}
      <Col xs={12} md={3} className="info mb-2 mb-md-0">
        {data.department_name && (
          <div>
            <strong>
              {intl.formatMessage({ id: 'app.global.department' })}:
            </strong>{' '}
            {data.department_name}
          </div>
        )}
        {data.title_name && (
          <div>
            <strong>{intl.formatMessage({ id: 'app.global.title' })}:</strong>{' '}
            {data.title_name}
          </div>
        )}
        {data.user_referent && (
          <div>
            <strong>
              {intl.formatMessage({
                id: 'app.containers.MyLibrariesPage.user_referent',
              })}
              :
            </strong>{' '}
            {data.user_referent}
          </div>
        )}
        {data.user_service_phone && (
          <div>
            <strong>
              {intl.formatMessage({
                id: 'app.containers.MyLibrariesPage.user_service_phone',
              })}
              :
            </strong>{' '}
            {data.user_service_phone}
          </div>
        )}
        {data.user_service_email && (
          <div>
            <strong>
              {intl.formatMessage({
                id: 'app.containers.MyLibrariesPage.user_service_email',
              })}
              :
            </strong>{' '}
            {data.user_service_email}
          </div>
        )}
      </Col>

      {/* Action buttons */}
      <Col xs={12} md={2} className="icons text-md-right">
        <NavLink
          to={editurl(data.library_id, data.id)}
          className="btn btn-icon mr-2"
        >
          <i className="fa-solid fa-pen-to-square" />
        </NavLink>
        <a href="#" className="btn btn-icon" onClick={deleteCallback}>
          <i className="fa-solid fa-trash" />
        </a>
      </Col>
    </Row>
  );
};

export default MyLibraryItem;
