import React, {useEffect, useState} from 'react';
import {requestGroupsOptionList, requestPostGroup, requestUpdateGroup, requestRemoveGroup} from '../actions'
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {groupsOptionListSelector, isPatronLoading} from '../selectors';
import EditTagItem from 'components/EditTagItem';
import messages from './messages';
import Loader from 'components/Form/Loader';
import {useIntl} from 'react-intl';
import InputSearch from 'components/Form/InputSearch';
import SectionTitle from 'components/SectionTitle';
// import './style.scss';


const ReferencesGroups = props => {
    // console.log('ReferencesGroups', props)
    const {dispatch, groupsOptionList, loading} = props;
    const intl = useIntl();

    useEffect(() => {
        dispatch(requestGroupsOptionList())
    }, [])

    
    const updateItem = (group_id, name) => {
        dispatch(requestUpdateGroup(group_id, name, intl.formatMessage(messages.groupUpdateMessage)))
    }
    
    const saveItem = (query) => {
        dispatch(requestPostGroup(query, intl.formatMessage(messages.groupCreateMessage)))
    }

    const removeItem = (group_id) => {
        // console.log(intl.formatMessage(messages.labelRemoveMessage))
        dispatch(requestRemoveGroup(group_id, intl.formatMessage(messages.groupRemoveMessage) ))
    } 

    return (
        <>
        <SectionTitle 
            title={messages.groups}
        />
        <div className="ReferencesGroups tags-list">
            <InputSearch
                icon="fa-solid fa-floppy-disk"
                placeholder={intl.formatMessage(messages.groupCreateNew)}
                submitCallBack={saveItem}
                className="w-50 mb-5"
            />
            <Loader show={loading}>
                {groupsOptionList.length > 0 && groupsOptionList.map(group => (
                        <EditTagItem 
                            key={`${group.label}-${group.value}`}
                            data={group}
                            updateItem={(group_id, name) => updateItem(group_id, name)}
                            removeItem={(group_id)=> removeItem(group_id)}
                            loading={loading}
                        />
                    ))}
            </Loader>
        </div>
        </>
    );
};



const mapStateToProps = createStructuredSelector({
    groupsOptionList: groupsOptionListSelector(),
    loading: isPatronLoading()
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

export default compose(withConnect)(ReferencesGroups);