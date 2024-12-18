import React from 'react';
import { Button } from 'reactstrap';
import { requestUpdateAccessToLibrary } from '../actions';
import { useIntl } from 'react-intl';
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
  const preferredStarClass = (pref) => {
    switch (pref) {
      case false:
        return 'notpreferred';
      case true:
        return 'preferred';
      default:
        return 'notpreferred';
    }
  };

  const statusClass = (status) => {
    switch (status) {
      case 0:
        return 'disabled';
      case 1:
        return 'success';
      case 2:
        return 'pending';
      default:
        return status;
    }
  };

  const intl = useIntl();

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
      <table className="table table-bordered">
        <thead className="thead-light">
          <tr className="text-center">
            <th>{intl.formatMessage(messages.date)}</th>
            <th>{intl.formatMessage(messages.library)}</th>
            <th>{intl.formatMessage(messages.status)}</th>
          </tr>
        </thead>
        <tbody>
          {librariesList.map((library, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-light' : ''}>
              <td className="text-center">
                {new Date(library.created_at).toLocaleDateString()}
              </td>
              <td className="text-center">
                {library.name} {library.label && <span>({library.label})</span>}
              </td>
              <td className="text-center">
                <i
                  className={`fa-solid ${
                    library.status === 1
                      ? 'fa-circle-check text-success'
                      : 'fa-circle-xmark text-danger'
                  }`}
                  title={library.status === 1 ? 'Enabled' : 'Disabled'}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BelongingLibraries;
