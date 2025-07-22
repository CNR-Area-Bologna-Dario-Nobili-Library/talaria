import React, { useState, useEffect, useRef } from 'react';
import {
  Nav,
  DropdownToggle,
  DropdownMenu,
  Dropdown,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  TabContent,
  TabPane,
} from 'reactstrap';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { requestNotifications } from 'containers/App/actions';
import makeSelectApp from 'containers/App/selectors';
import { Loader } from 'components';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import './style.scss';
import { requestNotificationsSaga } from 'containers/App/actions';

const Notification = props => {
  const { dispatch } = props;
  const [readNotifications, setReadNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [allNotifications, setAllNotifications] = useState([]);
  const [unreaded_total, setUnreaded_total] = useState(0);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const manuallyUpdatedNotifications = useRef({});
  const page = props.app.notifications.pagination;
  const loading = props.app.loading;
  const [prevUnreadTotal, setPrevUnreadTotal] = useState(0);
  const [animateBell, setAnimateBell] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5);
  const [animatedIds, setAnimatedIds] = useState([]);

  const toggleDropdown = () => setDropdownOpen(prev => !prev);

  function extractLibraryName(title) {
    const hashIndex = title.indexOf('#');
    if (hashIndex !== -1) {
      const substringAfterHash = title.substring(hashIndex + 1);
      const match = substringAfterHash.match(/(\S+)/);
      if (match && match[1]) {
        return match[1];
      }
    }
    return title;
  }

  function parseNotification(notification) {
    const { data } = notification;
    const libraryName = extractLibraryName(data.title);
    let libraryStatus = '';
    let description = data.message;

    const statusMatch = data.message.match(/status[:\s]*([a-zA-Z0-9_-]+)/i);
    if (statusMatch) {
      libraryStatus = statusMatch[1];
    }

    return { libraryName, libraryStatus, description };
  }

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      setShowPermissionModal(true);
    }
  }, []);

  const handleRequestPermission = () => {
    Notification.requestPermission().then(() => {
      setShowPermissionModal(false);
    });
  };

  // const showBrowserNotification = (title, message, url) => {
  //   if (Notification.permission === 'granted') {
  //     try {
  //       const notification = new Notification(title, {
  //         body: message,
  //         icon: '/path-to-icon.png',
  //       });
  //       notification.onclick = () => {
  //         window.open(url, '_blank');
  //       };
  //     } catch (error) {
  //       console.error('Error displaying notification:', error);
  //     }
  //   }
  // };

  const lazyLoad = event => {
    const menuTop = event.target.scrollTop;
    const menuHeight = event.target.clientHeight;
    const itemHeight = event.target.children[0]
      ? event.target.children[0].offsetHeight
      : 0;
    const totalItemsHeight =
      (readNotifications.length + unreadNotifications.length) * itemHeight;
    const currPage = page ? page.current_page : 1;
    const totalPages = page ? page.total_pages : 1;
    if (menuTop >= totalItemsHeight - menuHeight && totalPages > currPage) {
      !loading && dispatch(requestNotifications(currPage + 1));
    }
  };

  // 🔄 Normalize .read based on read_at
  const normalizeNotification = n => ({
    ...n,
    read: !!n.read_at,
  });

  useEffect(() => {
    const rawNotifications = props.app.notifications.data || [];

    // Apply manual updates if present
    const mergedNotifications = rawNotifications.map(n => {
      const override = manuallyUpdatedNotifications.current[n.id];
      return normalizeNotification(override || n);
    });

    const read = mergedNotifications.filter(n => n.read);
    const unread = mergedNotifications.filter(n => !n.read);

    setAllNotifications(mergedNotifications);
    setReadNotifications(read);
    setUnreadNotifications(unread);

    //Show unread count in the bell
    setUnreaded_total(unread.length);

    if (unread.length > prevUnreadTotal) {
      setAnimateBell(true);
      setTimeout(() => setAnimateBell(false), 2000);
    }

    setPrevUnreadTotal(unread.length);
  }, [props.app.notifications.data]);

  const handleToggleReadStatus = notify => {
    const wasUnread = !notify.read_at;

    const updatedNotify = {
      ...notify,
      read: wasUnread,
      read_at: wasUnread ? new Date().toISOString() : null,
    };

    manuallyUpdatedNotifications.current[notify.id] = updatedNotify;

    const updatedAll = allNotifications.map(n =>
      n.id === notify.id ? updatedNotify : n,
    );

    const read = updatedAll.filter(n => n.read);
    const unread = updatedAll.filter(n => !n.read);

    setAllNotifications(updatedAll);
    setReadNotifications(read);
    setUnreadNotifications(unread);
    setUnreaded_total(unread.length);

    setAnimateBell(true);
    setTimeout(() => setAnimateBell(false), 1000);

    dispatch(requestNotificationsSaga(notify.id, wasUnread));
  };

  const getTabNotifications = () => {
    switch (activeTab) {
      case 'unread':
        return unreadNotifications;
      case 'read':
        return readNotifications;
      default:
        return allNotifications;
    }
  };

  useEffect(() => {
    if (!props.app.notifications.data.length && !loading) {
      dispatch(requestNotifications());
    }
  }, []);

  const handleLoadMore = () => {
    const currentVisible = visibleCount;
    const nextVisible = currentVisible + 5;
    const newlyAdded = getTabNotifications()
      .slice(currentVisible, nextVisible)
      .map(n => n.id);

    setAnimatedIds(newlyAdded);
    setVisibleCount(nextVisible);
  };
  const handleShowLess = () => {
    setVisibleCount(5);
    setAnimatedIds([]);
  };

  return (
    <>
      <Nav className="notification" navbar>
        <Dropdown
          nav
          direction="down"
          isOpen={dropdownOpen}
          toggle={toggleDropdown}
        >
          <DropdownToggle nav>
            <i
              className={`fa-solid fa-bell d-table-cell ${
                animateBell ? 'bell-animated' : ''
              }`}
            >
              {unreaded_total > 0 && (
                <span className="count">{unreaded_total}</span>
              )}
            </i>
          </DropdownToggle>
          <DropdownMenu
            right
            onScroll={lazyLoad}
            className="notification-dropdown-menu"
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-around',
                padding: '8px 10px',
              }}
            >
              {['all', 'unread', 'read'].map(tab => (
                <button
                  className={`notification-tab-btn ${
                    activeTab === tab ? 'active' : ''
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            <TabContent activeTab={activeTab}>
              <TabPane tabId={activeTab}>
                {getTabNotifications().length === 0 ? (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '20px',
                      color: '#999',
                    }}
                  >
                    <i className="bi bi-bell-slash fs-3" />
                    <p className="mt-2 mb-0 fw-semibold">
                      {activeTab === 'unread'
                        ? 'No New Notifications'
                        : activeTab === 'read'
                        ? 'No Read Notifications'
                        : 'No Notifications'}
                    </p>
                  </div>
                ) : (
                  getTabNotifications()
                    .slice(0, visibleCount)
                    .map(notify => {
                      const parsed = parseNotification(notify);
                      const isUnread = !notify.read_at;

                      return (
                        <div
                          key={notify.id}
                          className={`notification-item ${
                            isUnread ? 'unread' : 'read'
                          } ${
                            animatedIds.includes(notify.id)
                              ? 'animated-entry'
                              : ''
                          }`}
                        >
                          <div>
                            <Link
                              to={notify.data.url}
                              style={{
                                color: '#007bff',
                                fontWeight: 'bold',
                                textDecoration: 'none',
                              }}
                            >
                              {parsed.libraryName
                                ? `Borrowing #${parsed.libraryName}`
                                : notify.data.title}
                            </Link>
                            <div style={{ fontSize: '13px', color: '#333' }}>
                              <strong>Status:</strong>{' '}
                              {parsed.libraryStatus || 'N/A'}
                            </div>
                            <div style={{ fontSize: '13px', color: '#333' }}>
                              <strong>Description:</strong> {parsed.description}
                            </div>
                            <button
                              className={`notification-action-btn ${
                                isUnread ? 'unread' : 'read'
                              }`}
                              onClick={() => handleToggleReadStatus(notify)}
                            >
                              <i
                                className={
                                  isUnread
                                    ? 'bi bi-check2'
                                    : 'bi bi-arrow-counterclockwise'
                                }
                                style={{ fontSize: '1rem' }}
                              />{' '}
                              {isUnread ? 'Mark as Read' : 'Mark as Unread'}
                            </button>
                          </div>
                        </div>
                      );
                    })
                )}
              </TabPane>
            </TabContent>
            <div className="notification-footer-button">
              {visibleCount < getTabNotifications().length ? (
                <Button
                  className="load-more-btn"
                  size="sm"
                  onClick={handleLoadMore}
                >
                  Load More
                </Button>
              ) : getTabNotifications().length > 5 ? (
                <Button
                  className="load-more-btn"
                  size="sm"
                  onClick={handleShowLess}
                >
                  Show Less
                </Button>
              ) : null}
            </div>

            <div className="notification-footer-link">
              <Link to="/user/notifications" className="go-to-inbox-link">
                <i className="bi bi-inbox" />
                <span>Go to Notification Inbox</span>
              </Link>
            </div>

            <Loader show={loading} />
          </DropdownMenu>
        </Dropdown>
      </Nav>

      {/* <Modal
        isOpen={showPermissionModal}
        toggle={() => setShowPermissionModal(false)}
      >
        <ModalHeader toggle={() => setShowPermissionModal(false)}>
          Enable Notifications
        </ModalHeader>
        <ModalBody>
          To stay updated with the latest notifications, please enable browser
          notifications.
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleRequestPermission}>
            Enable Notifications
          </Button>
          <Button
            color="secondary"
            onClick={() => setShowPermissionModal(false)}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal> */}
    </>
  );
};

const mapStateToProps = createStructuredSelector({
  app: makeSelectApp(),
});

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);
export default compose(withConnect)(Notification);
