import React from 'react';
import { Button } from 'reactstrap';
import { requestUpdateAccessToLibrary } from '../actions';
import {useIntl} from 'react-intl'
import globalMessages from 'utils/globalMessages';
import messages from './messages'; 

const BelongingLibraries = ({
  librariesList,
  gridtitleiconLink,
  history,
  dispatch,
  showeditbutton,
  showpreferredbutton,
}) => {
  const preferredStarClass = pref => {
    switch (pref) {
      case false:
        return 'notpreferred';
        break;
      case true:
        return 'preferred';
        break;
      default:
        return 'notpreferred';
        break;
    }
    return pref;
  };
  const statusClass = status => {
    switch (status) {
      case 0:
        return 'disabled';
        break;
      case 1:
        return 'success';
        break;
      case 2:
        return 'pending';
        break;
    }
    return status;
  };
  const intl = useIntl()

  const onSetIsPreferred = (id, libid, ispreferred) => {
    dispatch(
      requestUpdateAccessToLibrary({
        preferred: ispreferred,
        library_id: libid,
        id,
        noredirectToMyLibraries: true,
      }),
    );
  };

  return (
    <div className="container mt-4">
      <br />
      <div className="container mt-4">
        <h3 className="mb-4">
          <b>{intl.formatMessage(messages.header)}</b>{' '}
          {showeditbutton ? (
            <i
              className="fas fa-edit"
              onClick={() => history.push(gridtitleiconLink)}
              style={{ cursor: 'pointer' }}
            />
          ) : null}
        </h3>
        <br />
        <div className="row mb-3 justify-content-between">
          {showpreferredbutton && <div className="col-md-1">
            <div className="font-weight-bold" />
          </div>}
          <div className="col-md-2 d-flex align-items-center">    
            <div className="font-weight-bold">{intl.formatMessage(messages.status)}</div>
          </div>
          <div className="col-md-2">
            <div className="font-weight-bold">{intl.formatMessage(messages.date)}</div>
          </div>          
          <div className="col-md-7">
            <div className="font-weight-bold">{intl.formatMessage(messages.library)}
            </div>
          </div>          
          {/*<div className="col-md-3">
            <div className="font-weight-bold">{intl.formatMessage(messages.details)}</div>
          </div>*/}
        </div>
        {librariesList.map((library, index) => (
          <div className="row mb-3 justify-content-between" key={index}>
            {showpreferredbutton && library.status === 1 && <div className="col-md-1">
              <>
                <a
                  onClick={() =>
                    onSetIsPreferred(
                      library.id,
                      library.library_id,
                      library.preferred === 1 ? 0 : 1,
                    )
                  }           
                >
                  {
                    <i
                      className={`fa-solid fa-star preferred-star ${preferredStarClass(
                        library.preferred === 1,
                      )}`}
                    />
                  }
                </a>
              </>
            </div>}
            <div className="col-md-1">
                <div
                  className={`status-point ${statusClass(library.status)}`}
                />              
            </div>
            <div className="col-md-3">
              <div>{new Date(library.created_at).toLocaleDateString()}</div>
            </div>   
            <div className="col-md-7">
              <div>{library.name} <span>{library.label?"("+library.label+")":''}</span></div>
            </div>                   
            {/*<div className="col-md-3">
              <div>
                {library.department_name && (
                  <>
                    {library.department_name}
                    <br />
                  </>
                )}
                {library.title_name && (
                  <>
                    {library.title_name}
                    <br />
                  </>
                )}
                {library.user_referent && (
                  <>
                    {library.user_referent}
                    <br />
                  </>
                )}
                {library.user_service_phone && (
                  <>
                    {library.user_service_phone}
                    <br />
                  </>
                )}
                {library.user_service_email && (
                  <>
                    {library.user_service_email}
                    <br />
                  </>
                )}
              </div>
            </div>*/}
            {/* <div className="col-md-2">
              <div className="btn-group">
                {showEditButton && (
                  <a
                    href="#"
                    className="btn btn-icon"
                    onClick={() => handleEdit(library.library_id, library.id)}
                  >
                    <i className="fa-solid fa-pen-to-square" />
                  </a>
                )}

                {showDeleteButton && (
                  <a
                    href="#"
                    className="btn btn-icon"
                    onClick={() => handleDelete(library.library_id, library.id)}
                  >
                    <i className="fa-solid fa-trash" />
                  </a>
                )}
              </div>
            </div> */}            
          </div>                    
        ))}        
        {/* <div className="row mt-3 align-items-center">
            
            <div className="col-md-4">
              <p>
                Showing {startIndex}-{endIndex} results out of {totalItems}
              </p>
            </div>

           
            <div className="col-md-4 d-flex justify-content-center">
              <nav aria-label="Page navigation">
                <ul className="pagination">
                  {Array.from(
                    { length: Math.ceil(librariesList.length / itemsPerPage) },
                    (_, i) => (
                      <li
                        className={`page-item ${
                          currentPage === i + 1 ? 'active' : ''
                        }`}
                        key={i}
                      >
                        <button
                          type="button"
                          className="page-link"
                          onClick={() => handlePageChange(i + 1)}
                        >
                          {i + 1}
                        </button>
                      </li>
                    ),
                  )}
                </ul>
              </nav>
            </div>

            <div className="col-md-4 d-flex justify-content-end">
              <select
                id="items-per-page-select"
                className="form-control"
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
              </select>
            </div>
          </div>
          <hr />  */}
      </div>

      <br />
      <br />
      {/* <div className="row">
        <div className="col-md-6">
          <button
            className="btn btn-success btn-block"
            onClick={() => handleGoToReferenceManager()}
            type="button"
          >
            Go to Reference Manager
          </button>
        </div>

        {auth.permissions.roles && auth.permissions.roles.includes('patron') && (
          <div className="col-md-6">
            <button
              className="btn btn-primary btn-block"
              onClick={() => handleGoToMyLibraries()}
              type="button"
            >
              Go to My Libraries
            </button>
          </div>
        )}
      </div> */}
    </div>
  );
};

export default BelongingLibraries;
