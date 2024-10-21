import React, { useEffect } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { useIntl } from 'react-intl';
import messages from './messages';
import makeSelectLibrary from 'containers/Library/selectors';
import {
  requestMyLibraries,
  requestGetLibrary,
  requestGetTitlesOptionList,
  requestLibraryOptionList,
} from '../actions';
import {
  placesSelector,
  librariesSelector,
  titlesSelector,
  libraryListSelector,
} from '../selectors';
import makeSelectPatron, { isPatronLoading } from '../selectors';
import BelongingLibraries from '../BelongingLibraries/';
import history from 'utils/history';

function JointoLibPage(props) {
  const intl = useIntl();
  const { auth, dispatch, patron } = props;

  useEffect(() => {
    dispatch(requestLibraryOptionList());
    dispatch(requestGetTitlesOptionList());
    dispatch(requestMyLibraries());
  }, [dispatch]);

  return (
    <>
      {/* Top button: "Go to Reference Manager" */}
      {auth.permissions.roles.includes('patron') && (
        <div className="text-center mb-3">
          <button
            className="btn btn-success btn-lg btn-block"
            onClick={() => history.push('/patron/references/new')}
          >
            {intl.formatMessage(messages.buttonReferenceManager)}
          </button>
        </div>
      )}

      {patron.my_libraries.data.length > 0 ? (
        <div>
          <BelongingLibraries
            librariesList={patron.my_libraries.data}
            gridtitleiconLink="/patron/my-libraries"
            history={history}
            dispatch={dispatch}
            showeditbutton={true}
          />
        </div>
      ) : (
        <div className="container mt-3">
          <div className="row justify-content-center">
            <div className="col-md-12">
              <div className="alert alert-info text-center">
                <h3>{intl.formatMessage(messages.noassociatedlibraries)}</h3>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom buttons */}
      <div className="text-center mt-3">
      {auth.permissions.roles.includes('patron') && (
        <button
          className="btn btn-secondary btn-lg"
          onClick={() => history.push('/patron/my-libraries')}
        >
          {intl.formatMessage(messages.manageYourLibraries)}
        </button> )}
        <button
          className="btn btn-primary btn-lg ml-3"
          onClick={() => history.push('/patron/my-libraries/new')}
        >
          {intl.formatMessage(messages.joinNewLibrary)}
        </button>
      </div>
    </>
  );
}

const mapStateToProps = createStructuredSelector({
  library: makeSelectLibrary(),
  places: placesSelector(),
  titles: titlesSelector,
  libraries: librariesSelector,
  patron: makeSelectPatron(),
  isLoading: isPatronLoading(),
  libraryList: libraryListSelector(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(JointoLibPage);
