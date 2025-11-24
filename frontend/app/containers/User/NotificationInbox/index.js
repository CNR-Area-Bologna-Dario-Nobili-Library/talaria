import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import {
  requestNotifications,
  updateNotificationsAsRead,
  clearNotifications,
  markNotificationAsRead,
  deleteNotificationAction,
  deleteNotificationsBulkAction,
} from '../../App/actions';

import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import { useIntl, FormattedMessage } from 'react-intl';
import messages from './messages';

function NotificationInbox(props) {
  const { dispatch, notifications, unreaded_total, loading } = props;

  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const selectAllRef = useRef(null);
  const [filter, setFilter] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  const [sortColumn, setSortColumn] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [notificationsPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState(null);
  const [deleteMode, setDeleteMode] = useState('single'); // 'single' or 'bulk'

  // NEW: Track if user wants to select ALL across all pages
  const [selectAllPages, setSelectAllPages] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const intl = useIntl();

  useEffect(() => {
    dispatch(requestNotifications());
    return () => {
      dispatch(clearNotifications());
    };
  }, [dispatch]);

  // Reset selectAllPages when filters change
  useEffect(() => {
    setSelectAllPages(false);
    setSelectedNotifications([]);
  }, [filter, filterStatus, filterStartDate, filterEndDate]);

  const handleToggleSelect = id => {
    setSelectedNotifications(prev =>
      prev.includes(id)
        ? prev.filter(notificationId => notificationId !== id)
        : [...prev, id],
    );
    //Deselect "all pages" if user manually changes selection
    setSelectAllPages(false);
  };

  const handleMarkAllAsRead = () => {
    dispatch(updateNotificationsAsRead());
    setTimeout(() => dispatch(requestNotifications()), 300);
  };

  const handleSort = column => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  const getStatusLabel = () => {
    if (filterStatus === 'all') return intl.formatMessage(messages.statusAll);
    if (filterStatus === 'new') return intl.formatMessage(messages.statusNew);
    if (filterStatus === 'read') return intl.formatMessage(messages.statusRead);
    return intl.formatMessage(messages.statusLabel);
  };

  const normalizeNotification = n => ({
    ...n,
    read: !!n.read_at,
  });

  /**
   * FILTER
   */
  const filteredNotifications = notifications
    .map(n => ({
      ...n,
      read: !!n.read_at,
    }))
    .filter(notification => {
      const parsed = parseNotification(notification);

      const needle = filter.trim().toLowerCase();
      const searchFilter = (parsed.notificationDescription || '')
        .toLowerCase()
        .includes(needle);

      let statusFilter = true;
      if (filterStatus === 'new') {
        statusFilter = !notification.read;
      } else if (filterStatus === 'read') {
        statusFilter = notification.read;
      }

      let dateFilter = true;
      const createdDate = parseDate(notification.created_at);
      if (filterStartDate) {
        const startDate = parseDate(filterStartDate + ' 00:00:00');
        if (createdDate < startDate) dateFilter = false;
      }
      if (filterEndDate) {
        const endDate = parseDate(filterEndDate + ' 23:59:59');
        if (createdDate > endDate) dateFilter = false;
      }

      return searchFilter && statusFilter && dateFilter;
    });

  /**
   * SORT
   */
  const sortedNotifications = filteredNotifications.sort((a, b) => {
    if (sortColumn === 'created_at') {
      const aDate = parseDate(a.created_at);
      const bDate = parseDate(b.created_at);
      return sortOrder === 'asc' ? aDate - bDate : bDate - aDate;
    } else if (
      sortColumn === 'libraryName' ||
      sortColumn === 'libraryStatus' ||
      sortColumn === 'description'
    ) {
      const parsedA = parseNotification(a);
      const parsedB = parseNotification(b);
      let aValue, bValue;
      if (sortColumn === 'libraryName') {
        aValue = parsedA.libraryName;
        bValue = parsedB.libraryName;
      } else if (sortColumn === 'libraryStatus') {
        aValue = parsedA.libraryStatus;
        bValue = parsedB.libraryStatus;
      } else {
        aValue = parsedA.description;
        bValue = parsedB.description;
      }
      return sortOrder === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    } else {
      // fallback
      const aValue = a.data[sortColumn] || '';
      const bValue = b.data[sortColumn] || '';
      return sortOrder === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
  });

  /**
   * PAGINATION
   */
  const paginatedNotifications = sortedNotifications.slice(
    (currentPage - 1) * notificationsPerPage,
    currentPage * notificationsPerPage,
  );
  const totalPages = Math.ceil(
    sortedNotifications.length / notificationsPerPage,
  );

  /**
   * View details in modal
   */
  // const handleViewDetails = notification => {
  //   setSelectedNotification(notification);
  //   setModalOpen(true);
  // };

  function extractLibraryName(title) {
    if (title.toLowerCase().startsWith('library')) {
      const hashIndex = title.indexOf('#');
      if (hashIndex !== -1) {
        const substringAfterHash = title.substring(hashIndex + 1);
        const match = substringAfterHash.match(/(\S+)/);
        if (match && match[1]) {
          return match[1];
        }
      } else {
        const parts = title.split(' ');
        if (parts.length >= 2) {
          return parts[1];
        }
      }
    }
    return title;
  }

  /**
   * Parse notification data to get libraryName, libraryStatus, description.
   */
  function parseNotification(notification) {
    const data = notification && notification.data ? notification.data : {};
    const title = data && data.title ? String(data.title) : '';

    const libraryName = extractLibraryName(title);
    const libraryStatus = data && data.status ? String(data.status) : '';
    const notificationDescription = title;

    return { libraryName, libraryStatus, notificationDescription };
  }

  function parseDate(dateStr) {
    if (dateStr && !dateStr.includes('T')) {
      return new Date(dateStr.replace(' ', 'T'));
    }
    return new Date(dateStr);
  }

  const unreadCount = Array.isArray(notifications)
    ? notifications.filter(n => !n.read_at).length
    : 0;

  // Indeterminate state for header checkbox
  useEffect(() => {
    if (!selectAllRef.current) return;
    const pageIds = paginatedNotifications.map(n => n.id);
    const selectedOnPage = selectedNotifications.filter(id =>
      pageIds.includes(id),
    );

    if (selectAllPages) {
      selectAllRef.current.indeterminate = false;
    } else {
      selectAllRef.current.indeterminate =
        selectedOnPage.length > 0 && selectedOnPage.length < pageIds.length;
    }
  }, [selectedNotifications, paginatedNotifications, selectAllPages]);

  // Toggle select all on current page
  const handleToggleSelectAllOnPage = () => {
    const pageIds = paginatedNotifications.map(n => n.id);
    const allOnPageSelected = pageIds.every(id =>
      selectedNotifications.includes(id),
    );

    if (allOnPageSelected) {
      setSelectedNotifications(prev =>
        prev.filter(id => !pageIds.includes(id)),
      );
      setSelectAllPages(false);
    } else {
      setSelectedNotifications(prev =>
        Array.from(new Set([...prev, ...pageIds])),
      );
    }
  };

  // Select all notifications across all pages
  const handleSelectAllPages = () => {
    const allIds = sortedNotifications.map(n => n.id);
    setSelectedNotifications(allIds);
    setSelectAllPages(true);
  };

  // Clear all selections
  const handleClearSelection = () => {
    setSelectedNotifications([]);
    setSelectAllPages(false);
  };

  // Check if all on current page are selected
  const pageIds = paginatedNotifications.map(n => n.id);
  const allOnPageSelected =
    pageIds.length > 0 &&
    pageIds.every(id => selectedNotifications.includes(id));
  const showSelectAllBanner =
    allOnPageSelected &&
    !selectAllPages &&
    sortedNotifications.length > notificationsPerPage;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">
        <FormattedMessage {...messages.header} />
      </h2>

      {/* FILTERS CARD */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          {/* Filters Row */}
          <div className="row gy-3 gx-4">
            {/* Search */}
            <div className="col-lg-3 col-md-6">
              <label className="form-label fw-semibold text-dark">
                <FormattedMessage {...messages.searchLabel} />
              </label>
              <div className="position-relative">
                <span className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted">
                  <i className="bi bi-search" />
                </span>
                <input
                  type="text"
                  className="form-control ps-5 py-2 shadow-sm border rounded-3 border-secondary"
                  placeholder={intl.formatMessage(
                    messages.searchPlaceholderDescription,
                  )}
                  value={filter}
                  onChange={e => setFilter(e.target.value.toLowerCase())}
                />
              </div>
            </div>

            {/* Status */}
            <div className="col-lg-3 col-md-6">
              <label className="form-label fw-semibold text-dark">
                <FormattedMessage {...messages.statusLabel} />
              </label>
              <br />
              <select
                className="form-select py-2 shadow-sm border rounded-3 border-secondary"
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
              >
                <option value="all">
                  {intl.formatMessage(messages.statusAll)}
                </option>
                <option value="new">
                  {intl.formatMessage(messages.statusNew)}
                </option>
                <option value="read">
                  {intl.formatMessage(messages.statusRead)}
                </option>
              </select>
            </div>

            {/* Start Date */}
            <div className="col-lg-3 col-md-6">
              <label className="form-label fw-semibold text-dark">
                <FormattedMessage {...messages.startDateLabel} />
              </label>
              <input
                type="date"
                className="form-control py-2 shadow-sm border rounded-3 border-secondary"
                value={filterStartDate}
                onChange={e => setFilterStartDate(e.target.value)}
              />
            </div>

            {/* End Date */}
            <div className="col-lg-3 col-md-6">
              <label className="form-label fw-semibold text-dark">
                <FormattedMessage {...messages.endDateLabel} />
              </label>
              <input
                type="date"
                className="form-control py-2 shadow-sm border rounded-3 border-secondary"
                value={filterEndDate}
                onChange={e => setFilterEndDate(e.target.value)}
              />
            </div>
          </div>

          {/* Reset Button - New Row */}
          <div className="row mt-3">
            <div className="col text-end">
              <button
                className="btn btn-outline-danger px-4 py-2 shadow-sm rounded-3"
                onClick={() => {
                  setFilter('');
                  setFilterStatus('all');
                  setFilterStartDate('');
                  setFilterEndDate('');
                }}
              >
                <i className="bi bi-arrow-counterclockwise me-2" />
                <FormattedMessage {...messages.resetFilters} />
              </button>

              <button
                className="btn btn-outline-primary px-4 py-2 shadow-sm rounded-3 ms-3"
                onClick={handleMarkAllAsRead}
                disabled={unreadCount === 0}
              >
                <i className="bi bi-check2-square me-2" />
                <FormattedMessage {...messages.markAllAsRead} />
              </button>

              {/* Delete Selected */}
              <button
                className="btn btn-danger px-4 py-2 shadow-sm rounded-3 ms-3"
                onClick={() => {
                  if (selectedNotifications.length === 0) {
                    alert(
                      <FormattedMessage
                        {...messages.selectNotificationsMessage}
                      />,
                    );
                    return;
                  }

                  // Open modal for bulk delete
                  setDeleteMode('bulk');
                  setShowDeleteModal(true);
                }}
                disabled={selectedNotifications.length === 0}
                title={
                  <FormattedMessage {...messages.deleteNotificationSelected} />
                }
              >
                <i className="bi bi-trash-fill me-2" />
                {<FormattedMessage {...messages.deleteNotificationSelected} />}
                {selectedNotifications.length > 0 &&
                  ` (${
                    selectAllPages
                      ? sortedNotifications.length
                      : selectedNotifications.length
                  })`}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SELECT ALL 
        Because the default message contains rendered numerical data, 
        defaultMessage: `All ***${pageIds.length}*** notifications 
        on this page are selected.`,},
       
        we need to find a fix or remove the numbers
      */}
      {showSelectAllBanner && (
        <div
          className="alert alert-info d-flex justify-content-between align-items-center mb-3"
          role="alert"
        >
          <span>
            <i className="bi bi-info-circle me-2" />
            {<FormattedMessage {...messages.allpageGridSelected} />}
          </span>
          <button
            className="btn btn-sm btn-primary"
            onClick={handleSelectAllPages}
          >
            {<FormattedMessage {...messages.selectAllPages} />}

            {/* STILL CHECKING TO POPULATE NUMBERS IN MESSAGES 
            {intl.formatMessage(
              messages.selectAllPages || {
                id: 'app.notifications.selectAllPages',
                defaultMessage: `Select all ${
                  sortedNotifications.length
                } notifications`,
              },
            )} */}
          </button>
        </div>
      )}

      {/* ALL PAGES SELECTED BANNER */}
      {selectAllPages && (
        <div
          className="alert alert-success d-flex justify-content-between align-items-center mb-3"
          role="alert"
        >
          <span>
            <i className="bi bi-check-circle me-2" />
            {/* STILL CHECKING TO POPULATE NUMBERS IN MESSAGES 
            {intl.formatMessage(
              messages.allPagesSelected || {
                id: 'app.notifications.allPagesSelected',
                defaultMessage: `All ${
                  sortedNotifications.length
                } notifications are selected.`,
              },
            )} */}
            {<FormattedMessage {...messages.selectedAllPages} />}
          </span>
          <button
            className="btn btn-sm btn-danger"
            onClick={handleClearSelection}
          >
            {<FormattedMessage {...messages.clearSelection} />}
          </button>
        </div>
      )}

      {/* TABLE */}
      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th style={{ width: '50px' }}>
                <input
                  type="checkbox"
                  ref={selectAllRef}
                  onChange={handleToggleSelectAllOnPage}
                  checked={
                    paginatedNotifications.length > 0 &&
                    (selectAllPages ||
                      paginatedNotifications.every(n =>
                        selectedNotifications.includes(n.id),
                      ))
                  }
                  /*aria-label="Select all on this page"*/
                />
              </th>
              <th style={{ width: '50px' }}>
                <FormattedMessage {...messages.thIndex} />
              </th>
              <th
                style={{ width: '150px', cursor: 'pointer' }}
                onClick={() => handleSort('created_at')}
              >
                <FormattedMessage {...messages.thDate} />
                {sortColumn === 'created_at' &&
                  (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th
                style={{ width: '150px', cursor: 'pointer' }}
                onClick={() => handleSort('libraryName')}
              >
                <FormattedMessage {...messages.thDetail} />
                {sortColumn === 'libraryName' &&
                  (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th style={{ width: '200px' }} className="text-center">
                <FormattedMessage {...messages.thActions} />
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedNotifications.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-muted">
                  <div>
                    {filterStatus === 'new' ? (
                      <>
                        <i className="bi bi-bell-slash fs-4" />
                        <div className="mt-2">
                          {' '}
                          <FormattedMessage {...messages.emptyNew} /> 😊
                        </div>
                      </>
                    ) : filterStatus === 'read' ? (
                      <>
                        <i className="bi bi-inbox fs-4" />
                        <div className="mt-2">
                          <FormattedMessage {...messages.emptyRead} />
                        </div>
                      </>
                    ) : (
                      <>
                        <i className="bi bi-info-circle fs-4" />
                        <div className="mt-2">
                          <FormattedMessage {...messages.emptyAll} />
                        </div>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              paginatedNotifications.map((notification, index) => {
                const isSelected = selectedNotifications.includes(
                  notification.id,
                );
                const parsed = parseNotification(notification);
                const createdDate = parseDate(notification.created_at);

                const rowStyle = {
                  fontWeight: notification.read ? 'normal' : 'bold',
                  backgroundColor: notification.read
                    ? 'transparent'
                    : '#e8f4ff',
                };

                return (
                  <tr key={notification.id} style={rowStyle}>
                    <td>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(notification.id)}
                      />
                    </td>
                    <td>
                      {(currentPage - 1) * notificationsPerPage + index + 1}
                    </td>
                    <td>
                      {createdDate.toLocaleDateString()}
                      <br />
                      {createdDate.toLocaleTimeString()}
                    </td>
                    <td>
                      {parsed.libraryName}
                      {!notification.read && (
                        <span className="badge bg-info ms-2">
                          {' '}
                          <FormattedMessage {...messages.badgeNew} />
                        </span>
                      )}
                    </td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center align-items-center gap-0">
                        {/* View */}
                        {/* <button
                          className="btn btn-outline-info px-1 py-2 fs-2"
                          onClick={() => handleViewDetails(notification)}
                          title={intl.formatMessage(messages.viewDetailsTitle)}
                        >
                          <span style={{ fontSize: '1.5rem' }}>🔎</span>
                        </button> */}

                        {/* Toggle Read */}
                        <button
                          className={`btn ${
                            notification.read
                              ? 'btn-outline-secondary'
                              : 'btn-outline-success'
                          } px-1 py-2 fs-5`}
                          onClick={() => {
                            dispatch(
                              markNotificationAsRead(
                                notification.id,
                                !notification.read_at,
                              ),
                            );
                            setTimeout(
                              () => dispatch(requestNotifications()),
                              500,
                            );
                          }}
                          title={
                            notification.read
                              ? intl.formatMessage(messages.markAsUnreadTitle)
                              : intl.formatMessage(messages.markAsReadTitle)
                          }
                        >
                          <span style={{ fontSize: '1.5rem' }}>
                            {notification.read ? '📬' : '✉️'}
                          </span>
                        </button>

                        {/* Delete */}
                        <button
                          className="btn btn-outline-danger px-1 py-2 fs-5"
                          onClick={() => {
                            setNotificationToDelete(notification);
                            setDeleteMode('single');
                            setShowDeleteModal(true);
                          }}
                          title={intl.formatMessage(messages.delete)}
                        >
                          <span style={{ fontSize: '1.5rem' }}>🗑</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <button
          className="btn btn-primary"
          style={{ minWidth: '120px' }}
          onClick={() =>
            setCurrentPage(currentPage === 1 ? totalPages : currentPage - 1)
          }
        >
          <FormattedMessage {...messages.previous} />
        </button>
        <span className="fw-bold fs-5">
          {intl.formatMessage(messages.pageOf, {
            current: currentPage,
            total: totalPages,
          })}
        </span>
        <button
          className="btn btn-primary"
          style={{ minWidth: '120px' }}
          onClick={() =>
            setCurrentPage(currentPage === totalPages ? 1 : currentPage + 1)
          }
        >
          <FormattedMessage {...messages.next} />
        </button>
      </div>

      {/* MODAL Popup */}

      <>
        {/* UNIFIED DELETE CONFIRMATION MODAL FOR ONE/ALL NOTICATION */}
        <Modal
          isOpen={showDeleteModal}
          toggle={() => setShowDeleteModal(false)}
          centered
        >
          <ModalHeader toggle={() => setShowDeleteModal(false)}>
            <FormattedMessage {...messages.confirmDeleteTitle} />
          </ModalHeader>
          <ModalBody>
            {deleteMode === 'single' ? (
              <FormattedMessage {...messages.confirmDeleteMessage} />
            ) : (
              <FormattedMessage
                {...messages.confirmDeleteBulkMessage}
                values={{
                  count: selectAllPages
                    ? sortedNotifications.length
                    : selectedNotifications.length,
                }}
              />
            )}
          </ModalBody>
          <ModalFooter>
            <button
              className="btn btn-secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              <FormattedMessage {...messages.cancel} />
            </button>
            <button
              className="btn btn-danger"
              onClick={() => {
                if (deleteMode === 'single') {
                  // Delete single notification
                  dispatch(deleteNotificationAction(notificationToDelete.id));
                } else {
                  // Delete multiple notifications
                  dispatch(
                    deleteNotificationsBulkAction(selectedNotifications),
                  );
                  setSelectedNotifications([]);
                  setSelectAllPages(false);
                }
                setShowDeleteModal(false);
                setTimeout(() => dispatch(requestNotifications()), 500);
              }}
            >
              <FormattedMessage {...messages.delete} />
            </button>
          </ModalFooter>
        </Modal>
      </>
    </div>
  );
}

const mapStateToProps = state => ({
  notifications: state.app.notifications.data || [],
  unreaded_total: state.app.notifications.unreaded_total || 0,
  loading: state.app.loading || false,
});

export default connect(mapStateToProps)(NotificationInbox);
