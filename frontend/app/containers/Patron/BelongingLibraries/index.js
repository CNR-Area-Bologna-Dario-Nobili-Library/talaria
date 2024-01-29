import React from 'react';

const BelongingLibraries = ({
  librariesToDisplay,
  startIndex,
  endIndex,
  totalItems,
  librariesList,
  currentPage,
  handlePageChange,
  itemsPerPage,
  handleItemsPerPageChange,
  statusClass,
  handleGoToReferenceManager,
  handleGoToMyLibraries,
  auth,
}) => {
    
    return (
    <div className="container mt-4">
     
      <br />
      <div className="container mt-4">
          <h3 className="mb-4">
            <b>Belonging Libraries</b>
          </h3>
          <br />
          <div className="row mb-3">
            <div className="col-md-4">
              <div className="font-weight-bold">Library</div>
            </div>
            <div className="col-md-2">
              <div className="font-weight-bold">Date</div>
            </div>
            <div className="col-md-2">
              <div className="font-weight-bold">Status</div>
            </div>
            <div className="col-md-4">
              <div className="font-weight-bold">Details</div>
            </div>
          </div>
          {librariesToDisplay.map((library, index) => (
            <div className="row mb-3 row-separator" key={index}>
              <div className="col-md-4">
                <div>{library.name}</div>
                <div>{library.label}</div>

              </div>
              
              <div className="col-md-2">
                <div>
                {library.created_at}
                </div>
              </div>
              <div className="col-md-2">
                <div>
                  <div
                    className={`status-point ${statusClass(library.status)}`}
                  />
                </div>
              </div>

              <div className="col-md-4">
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
              </div>
            </div>
          ))}
          <hr /> {/* Separator */}
          <div className="row mt-3 align-items-center">
            {/* Showing results text on the left */}
            <div className="col-md-4">
              <p>
                Showing {startIndex}-{endIndex} results out of {totalItems}
              </p>
            </div>

            {/* Pagination in the center */}
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

            {/* Dropdown on the right */}
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
          <hr /> {/* Separator */}
        </div>

        <br />
        <br />
        <div className="row">
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
        </div>
    </div>
  );
};

export default BelongingLibraries;
