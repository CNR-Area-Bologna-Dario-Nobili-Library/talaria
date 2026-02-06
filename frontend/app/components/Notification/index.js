import React, { useState, useEffect, useMemo } from 'react';
import {
  Nav,
  DropdownToggle,
  DropdownMenu,
  Dropdown,
  Button,
  TabContent,
  TabPane,
  UncontrolledDropdown,
  DropdownItem,
} from 'reactstrap';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  requestNotifications,
  // ⬇️ use the same action the inbox uses
  markNotificationAsRead,
} from 'containers/App/actions';
import makeSelectApp from 'containers/App/selectors';
import { Loader } from 'components';
import { Link } from 'react-router-dom';
import './style.scss';
import { useIntl, FormattedMessage } from 'react-intl';
import messages from './messages';


const Notification = props => {
  const { dispatch } = props;

  const [readNotifications, setReadNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [allNotifications, setAllNotifications] = useState([]);

  const [activeTab, setActiveTab] = useState('all');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const page = props.app.notifications.pagination;
  const loading = props.app.loading;

  const [animateBell, setAnimateBell] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5);
  const [animatedIds, setAnimatedIds] = useState([]);
  const [pendingIds, setPendingIds] = useState(new Set());
  const [prevUnreadTotal, setPrevUnreadTotal] = useState(0);

  const toggleDropdown = () => setDropdownOpen(prev => !prev);
  const intl = useIntl();

  const normalizeNotification = n => ({
    ...n,
    read: !!n.read_at,
  });

  // Build lists whenever store data changes
  useEffect(() => {
    const raw = (props.app.notifications && props.app.notifications.data) || [];
    const merged = raw.map(normalizeNotification);

    const read = merged.filter(n => n.read);
    const unread = merged.filter(n => !n.read);

    setAllNotifications(merged);
    setReadNotifications(read);
    setUnreadNotifications(unread);

    // Animate bell when unread increases (using authoritative store value when present)
    const storeUnread =
      props.app.notifications && props.app.notifications.unreaded_total;
    const effectiveUnread =
      typeof storeUnread === 'number' ? storeUnread : unread.length;

    if (effectiveUnread > prevUnreadTotal) {
      setAnimateBell(true);
      setTimeout(() => setAnimateBell(false), 800);
    }
    setPrevUnreadTotal(effectiveUnread);
  }, [props.app.notifications, prevUnreadTotal]);

  // Fresh pull whenever dropdown opens
  useEffect(() => {
    if (dropdownOpen) {
      dispatch(requestNotifications());
    }
  }, [dropdownOpen, dispatch]);

  // Use store unread count primarily, fallback to local computation
  const unreadTotal = useMemo(() => {
    const storeUnread =
      props.app.notifications && props.app.notifications.unreaded_total;
    if (typeof storeUnread === 'number') return storeUnread;
    return allNotifications.filter(n => !n.read_at).length;
  }, [props.app.notifications, allNotifications]);

  const lazyLoad = event => {
    const menuTop = event.target.scrollTop;
    const menuHeight = event.target.clientHeight;
    const firstChild =
      event.target && event.target.children && event.target.children[0];
    const itemHeight = firstChild ? firstChild.offsetHeight : 0;

    const totalItemsHeight =
      (readNotifications.length + unreadNotifications.length) * itemHeight;

    const currPage = page ? page.current_page : 1;
    const totalPages = page ? page.total_pages : 1;

    if (menuTop >= totalItemsHeight - menuHeight && totalPages > currPage) {
      if (!loading) {
        dispatch(requestNotifications(currPage + 1));
      }
    }
  };

  // Server‑authoritative toggle (no optimistic local flip)
  const handleToggleReadStatus = notify => {
    if (pendingIds.has(notify.id)) return;

    const markAsRead = !notify.read_at; // unread -> true, read -> false

    setPendingIds(prev => {
      const next = new Set(prev);
      next.add(notify.id);
      return next;
    });

    // Use the SAME action signature the inbox uses
    dispatch(markNotificationAsRead(notify.id, markAsRead));

    // After backend updates, pull fresh data
    setTimeout(() => {
      dispatch(requestNotifications());
      setPendingIds(prev => {
        const next = new Set(prev);
        next.delete(notify.id);
        return next;
      });
    }, 400);
  };

  // Mark notification as read when clicked (not toggling)
  const handleNotificationClick = notify => {
    // Only mark as read if it's currently unread
    if (!notify.read_at && !pendingIds.has(notify.id)) {
      setPendingIds(prev => {
        const next = new Set(prev);
        next.add(notify.id);
        return next;
      });

      dispatch(markNotificationAsRead(notify.id, true));

      setTimeout(() => {
        dispatch(requestNotifications());
        setPendingIds(prev => {
          const next = new Set(prev);
          next.delete(notify.id);
          return next;
        });
      }, 400);
    }
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

  // Initial fetch
  useEffect(() => {
    const hasData =
      props.app.notifications &&
      props.app.notifications.data &&
      props.app.notifications.data.length;
    if (!hasData && !loading) {
      dispatch(requestNotifications());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLoadMore = () => {
    const nextVisible = visibleCount + 5;
    const newlyAdded = getTabNotifications()
      .slice(visibleCount, nextVisible)
      .map(n => n.id);
    setAnimatedIds(newlyAdded);
    setVisibleCount(nextVisible);
  };

  const handleShowLess = () => {
    setVisibleCount(5);
    setAnimatedIds([]);
  };

  const handleMarkAllAsRead = () => {
    const unreadIds = unreadNotifications.map(n => n.id);
    unreadIds.forEach(id => {
      dispatch(markNotificationAsRead(id, true));
    });
    setTimeout(() => {
      dispatch(requestNotifications());
    }, 400);
  };

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
    const data = notification.data;
    const libraryName = extractLibraryName(data.title);
    return { libraryName, libraryStatus: '', description: '' };
  }
  // build this before return()
  const tabs = [
    { key: 'all', label: intl.formatMessage(messages.tabAll), count: allNotifications.length },
    { key: 'unread', label: intl.formatMessage(messages.tabUnread), count: unreadNotifications.length },
    { key: 'read', label: intl.formatMessage(messages.tabRead), count: readNotifications.length },
  ];

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
              className={
                'fa-solid fa-bell d-table-cell ' +
                (animateBell ? 'bell-animated' : '')
              }
            >
              {unreadTotal > 0 && <span className="count">{unreadTotal}</span>}
            </i>
          </DropdownToggle>

          <DropdownMenu
            right
            onScroll={lazyLoad}
            className="notification-dropdown-menu"
          >
            {/* Header Section */}
            <div className="notification-header">
              <div className="notification-header-content">
                <h6 className="notification-title">
                  <FormattedMessage {...messages.header} />
                </h6>
                {unreadNotifications.length > 0 && (
                  <UncontrolledDropdown>
                    <DropdownToggle
                      tag="button"
                      className="notification-header-menu-btn"
                    >
                      <i className="fa fa-ellipsis-h" />
                    </DropdownToggle>
                    <DropdownMenu right className="notification-header-dropdown">
                      <DropdownItem onClick={handleMarkAllAsRead} className="notification-header-dropdown-item">
                        <i className="fa fa-check" />
                        <FormattedMessage {...messages.markAllAsRead} />
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                )}
              </div>
            </div>

            {/* Filter Tabs Section */}
            <div className="notification-tabs-container">
                {tabs.map(tab => {
                  const isActive = activeTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      className={
                        'notification-tab-btn ' +
                        (isActive ? 'active' : '')
                      }
                      onClick={() => setActiveTab(tab.key)}
                    >
                      <span>{tab.label}</span>
                      <span className="tab-count">{tab.count}</span>
                    </button>
                  );
                })}
            </div>

            <TabContent activeTab={activeTab}>
              <TabPane tabId={activeTab}>
                {getTabNotifications().length === 0 ? (
                  <div className="notification-empty">
                    <div className="notification-empty-icon">
                      <i className="fa fa-bell-slash" />
                    </div>
                    <p>
                      {activeTab === 'unread' ? (
                        <FormattedMessage {...messages.emptyUnread} />
                      ) : activeTab === 'read' ? (
                        <FormattedMessage {...messages.emptyRead} />
                      ) : (
                        <FormattedMessage {...messages.emptyAll} />
                      )}
                    </p>
                  </div>
                ) : (
                  getTabNotifications()
                    .slice(0, visibleCount)
                    .map(notify => {
                      const parsed = parseNotification(notify);
                      const isUnread = !notify.read_at;


                      const notificationUrl = (notify && notify.data && notify.data.url) || '#';
                      let relativePath = notificationUrl;

                      try {
                        if (notificationUrl !== '#' && (notificationUrl.indexOf('http') === 0 || notificationUrl.indexOf('://') !== -1)) {
                          const urlObj = new URL(notificationUrl);
                          relativePath = urlObj.pathname + urlObj.search + urlObj.hash;
                        }
                      } catch (e) {
                        // If parsing fails, use original URL as fallback
                      }

                      return (
                        <div
                          key={notify.id}
                          className={
                            'notification-item ' +
                            (isUnread ? 'unread' : 'read') +
                            (animatedIds.indexOf(notify.id) !== -1
                              ? ' animated-entry'
                              : '')
                          }
                          onClick={() => handleNotificationClick(notify)}
                        >
                          {/* Blue dot indicator */}
                          <div className="notification-dot-container">
                            <div className={`notification-dot ${isUnread ? 'show' : ''}`} />
                          </div>

                          {/* Content */}
                          <div className="notification-content">
                            <Link
                              to={relativePath}
                              className="notification-link"
                            >
                              {(notify && notify.data && notify.data.title) || ''}
                            </Link>
                          </div>

                          {/* Envelope icon button - Toggle Read/Unread */}
                          <button
                            className="notification-icon-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleReadStatus(notify);
                            }}
                            disabled={pendingIds.has(notify.id)}
                            title={isUnread ? intl.formatMessage(messages.markAsRead) : intl.formatMessage(messages.markAsUnread)}
                            aria-label={isUnread ? intl.formatMessage(messages.markAsRead) : intl.formatMessage(messages.markAsUnread)}
                          >
                            <i
                              className={
                                isUnread
                                  ? 'fa fa-envelope'
                                  : 'fa fa-envelope-open'
                              }
                            />
                          </button>
                        </div>
                      );
                    })
                )}
              </TabPane>
            </TabContent>

            {(getTabNotifications().length > 5 || visibleCount > 5) && (
              <div className="notification-footer-button">
                {visibleCount < getTabNotifications().length ? (
                  <Button
                    className="load-more-btn"
                    size="sm"
                    onClick={handleLoadMore}
                  >
                    <FormattedMessage {...messages.loadMore} />
                  </Button>
                ) : (
                  <Button
                    className="load-more-btn"
                    size="sm"
                    onClick={handleShowLess}
                  >
                    <FormattedMessage {...messages.showLess} />
                  </Button>
                )}
              </div>
            )}

            <div className="notification-footer-link">
              <Link to="/user/notifications" className="go-to-inbox-link">
                <i className="fa fa-inbox" />
                <span>
                  <FormattedMessage {...messages.goToInbox} />
                </span>
              </Link>
            </div>

            {/* <Loader show={loading} /> */}
          </DropdownMenu>
        </Dropdown>
      </Nav>
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
