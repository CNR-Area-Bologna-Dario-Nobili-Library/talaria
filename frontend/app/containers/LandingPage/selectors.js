import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Landing Page Selectors
 */

const permissionbox = state => state.permissionbox || initialState;

const acceptPermissionLoadingSelector = createSelector(
  permissionbox,
  state => state.acceptPermissionLoading,
);

const rejectPermissionLoadingSelector = createSelector(
  permissionbox,
  state => state.rejectPermissionLoading,
);

export {
  acceptPermissionLoadingSelector,
  rejectPermissionLoadingSelector,
};
