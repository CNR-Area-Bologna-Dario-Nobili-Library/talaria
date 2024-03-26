import { createSelector } from 'reselect';
import { initialState } from 'containers/LandingPage/reducer';

/**
 * Landing Page Selectors
 */

const permissionBox = state => state.permissionBox || initialState;

const acceptPermissionLoadingSelector = () =>
  createSelector(
    permissionBox,
    (state) => state.acceptPermissionLoading
  );

const rejectPermissionLoadingSelector = () =>
  createSelector(
    permissionBox,
    (state) => state.rejectPermissionLoading
  );

export {  acceptPermissionLoadingSelector,
  rejectPermissionLoadingSelector, };
