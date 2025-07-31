import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  requestNotifications,
  updateNotificationsAsRead,
  clearNotifications,
  markNotificationAsRead,
  deleteNotificationAction,
} from '../../App/actions';

import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

function NotificationInbox(props) {
  const { dispatch, notifications, unreaded_total, loading } = props;

  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [filter, setFilter] = useState(''); // text filter
  const [filterStatus, setFilterStatus] = useState('all'); // "all", "new", "read"
  const [filterStartDate, setFilterStartDate] = useState(''); // date range start
  const [filterEndDate, setFilterEndDate] = useState(''); // date range end

  const [sortColumn, setSortColumn] = useState('created_at'); // default sort
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [notificationsPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  useEffect(() => {
    dispatch(requestNotifications());
    return () => {
      dispatch(clearNotifications());
    };
  }, [dispatch]);

  /**
   * Toggle selection of a notification (checkbox)
   */
  const handleToggleSelect = id => {
    setSelectedNotifications(prev =>
      prev.includes(id)
        ? prev.filter(notificationId => notificationId !== id)
        : [...prev, id],
    );
  };

  /**
   * Mark all as read
   */
  const handleMarkAllAsRead = () => {
    dispatch(updateNotificationsAsRead());
  };

  /**
   * Sorting
   */
  const handleSort = column => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  /**
   * The label shown on the dropdown button based on filterStatus
   */
  const getStatusLabel = () => {
    if (filterStatus === 'all') return 'All';
    if (filterStatus === 'new') return 'New (Unread)';
    if (filterStatus === 'read') return 'Read';
    return 'Status';
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
      read: !!n.read_at, // ✅ make sure this is always injected
    }))
    .filter(notification => {
      const parsed = parseNotification(notification);

      // text filter
      const searchFilter =
        parsed.libraryName.toLowerCase().includes(filter) ||
        parsed.description.toLowerCase().includes(filter);

      // status filter
      let statusFilter = true;
      if (filterStatus === 'new') {
        statusFilter = !notification.read;
      } else if (filterStatus === 'read') {
        statusFilter = notification.read;
      }

      console.log('🧪 Current Tab Filter:', filterStatus);
      // date range
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
  const handleViewDetails = notification => {
    setSelectedNotification(notification);
    setModalOpen(true);
  };

  /**
   * Extract a library name from the title.
   */
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
    const { data } = notification;
    const libraryName = extractLibraryName(data.title);
    let libraryStatus = '';
    let description = '';
    //let description = JSON.stringify(data); // Always show the full message as description

    // Extract status like "Request status:requested"
    // const statusMatch = data.message.match(/status[:\s]*([a-zA-Z0-9_-]+)/i);
    // if (statusMatch) {
    //   libraryStatus = statusMatch[1];
    // }

    return { libraryName, libraryStatus, description };
  }

  /**
   * parseDate:
   * Converts "YYYY-MM-DD HH:MM:SS" => "YYYY-MM-DDTHH:MM:SS" => Date object
   */
  function parseDate(dateStr) {
    if (dateStr && !dateStr.includes('T')) {
      return new Date(dateStr.replace(' ', 'T'));
    }
    return new Date(dateStr);
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Notifications</h2>

      {/* FILTERS CARD */}
      {/* 🔍 Modern Filter Box */}
      {/* 🔍 Ultra-Clean, Priority-Enforced Filter Box */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          {/* Filters Row */}
          <div className="row gy-3 gx-4">
            {/* 🔍 Search */}
            <div className="col-lg-3 col-md-6">
              <label className="form-label fw-semibold text-dark">
                Search Notifications
              </label>
              <div className="position-relative">
                <span className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted">
                  <i className="bi bi-search" />
                </span>
                <input
                  type="text"
                  className="form-control ps-5 py-2 shadow-sm border rounded-3 border-secondary"
                  placeholder="Library or description"
                  value={filter}
                  onChange={e => setFilter(e.target.value.toLowerCase())}
                />
              </div>
            </div>

            {/* Status */}
            <div className="col-lg-3 col-md-6">
              <label className="form-label fw-semibold text-dark">Status</label>
              <br />
              <select
                className="form-select py-2 shadow-sm border rounded-3 border-secondary"
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
              >
                <option value="all">All</option>
                <option value="new">New (Unread)</option>
                <option value="read">Read</option>
              </select>
            </div>

            {/* Start Date */}
            <div className="col-lg-3 col-md-6">
              <label className="form-label fw-semibold text-dark">
                Start Date
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
                End Date
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
                Reset Filters
              </button>

              <button
                className="btn btn-outline-primary px-4 py-2 shadow-sm rounded-3 ms-3"
                onClick={handleMarkAllAsRead}
                disabled={unreaded_total === 0}
              >
                <i className="bi bi-check2-square me-2" />
                Mark All as Read
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th style={{ width: '50px' }} />
              <th style={{ width: '50px' }}>#</th>
              <th
                style={{ width: '150px', cursor: 'pointer' }}
                onClick={() => handleSort('created_at')}
              >
                Date{' '}
                {sortColumn === 'created_at' &&
                  (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th
                style={{ width: '150px', cursor: 'pointer' }}
                onClick={() => handleSort('libraryName')}
              >
                Notification Detail{' '}
                {sortColumn === 'libraryName' &&
                  (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th style={{ width: '200px' }} className="text-center">
                Actions
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
                        <div className="mt-2">No New Notifications 😊</div>
                      </>
                    ) : filterStatus === 'read' ? (
                      <>
                        <i className="bi bi-inbox fs-4" />
                        <div className="mt-2">No Read Notifications</div>
                      </>
                    ) : (
                      <>
                        <i className="bi bi-info-circle fs-4" />
                        <div className="mt-2">No Notifications Found</div>
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
                        <span className="badge bg-info ms-2">New</span>
                      )}
                    </td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center align-items-center gap-0">
                        {/* View */}
                        <button
                          className="btn btn-outline-info px-1 py-2 fs-2"
                          onClick={() => handleViewDetails(notification)}
                          title="View Details"
                        >
                          <span style={{ fontSize: '1.5rem' }}>🔎</span>
                        </button>

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
                              ? 'Mark as Unread'
                              : 'Mark as Read'
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
                            setShowDeleteModal(true);
                          }}
                          title="Delete"
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
          Previous
        </button>
        <span className="fw-bold fs-5">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="btn btn-primary"
          style={{ minWidth: '120px' }}
          onClick={() =>
            setCurrentPage(currentPage === totalPages ? 1 : currentPage + 1)
          }
        >
          Next
        </button>
      </div>

      {/* MODAL Popup */}
      {selectedNotification && (
        <Modal
          isOpen={modalOpen}
          toggle={() => setModalOpen(!modalOpen)}
          centered
        >
          <ModalHeader toggle={() => setModalOpen(false)}>
            Notification Details
          </ModalHeader>
          <ModalBody>
            <p>
              <strong>Description:</strong>{' '}
              {parseNotification(selectedNotification).libraryName}
            </p>
            <p>
              <strong>Status:</strong>{' '}
              {parseNotification(selectedNotification).libraryStatus}
            </p>
            <p>
              <strong>Date:</strong>{' '}
              {parseDate(selectedNotification.created_at).toLocaleDateString()}{' '}
              {parseDate(selectedNotification.created_at).toLocaleTimeString()}
            </p>
            <p>
              <strong>Visit Link:</strong>{' '}
              <a
                href={
                  selectedNotification && selectedNotification.data
                    ? selectedNotification.data.url
                    : '#'
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-decoration-underline"
              >
                Open Request Detail
              </a>
            </p>
          </ModalBody>

          <ModalFooter>
            <button
              className="btn btn-secondary"
              onClick={() => setModalOpen(false)}
            >
              Close
            </button>
          </ModalFooter>
        </Modal>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      <Modal
        isOpen={showDeleteModal}
        toggle={() => setShowDeleteModal(false)}
        centered
      >
        <ModalHeader toggle={() => setShowDeleteModal(false)}>
          Confirm Deletion
        </ModalHeader>
        <ModalBody>
          Are you sure you want to delete this notification?
        </ModalBody>
        <ModalFooter>
          <button
            className="btn btn-secondary"
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </button>
          <button
            className="btn btn-danger"
            onClick={() => {
              dispatch(deleteNotificationAction(notificationToDelete.id));
              setShowDeleteModal(false);
              setTimeout(() => dispatch(requestNotifications()), 500);
            }}
          >
            Delete
          </button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

const mapStateToProps = state => ({
  notifications: state.app.notifications.data || [],
  unreaded_total: state.app.notifications.unreaded_total || 0,
  loading: state.app.loading || false,
});

export default connect(mapStateToProps)(NotificationInbox);
