import React, { useEffect, useState } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { requestFindOA, cleanImportedreference } from './actions';
import makeSelectOASearchReference, {
  isOASearchReferenceLoading,
} from './selectors';

import OASearchReferenceForm from '../../components/OASearchReferenceForm';
import { set } from 'lodash';
import { parseFromOpenAlex } from '../../utils/apiExternal';

const OASearchReference = props => {
  const {
    goToForm,
    showReference,
    onFound,
    onNotFound,
    onStartSearch,
    dispatch,
    isLoading,
    oasearchreference,
  } = props;

  console.log('OASEARCHREFERENCE init', oasearchreference);

  const oareference = oasearchreference.oareference;

  console.log('OASEARCHREFERENCE oareference', oareference);

  //const [isMounted, setIsMounted] = useState(false);

  //const [refData,setRefData] = useState(null);
  const [found, setFound] = useState(null);

  const findReferenceBySearchParams = query => {
    console.log('OASEARCHREFERENCE findReferenceBySearchParams:', query);
    if (onStartSearch) onStartSearch();

    setFound(null);

    let data = {};

    //try DOI
    let doi = query.match(/\b((10\.\d{4,9}\/[-._;()/:A-Z0-9a-z]+))/);
    if (doi != null) {
      const lowerDoi = doi[0].toLowerCase();
      console.log('OASEARCHREFERENCE DOI MATCH!', lowerDoi);
      data.doi = lowerDoi;
      //dispatch(requestFindReferenceByDOI(doi[0]))
    } else {
      //else try ISBN ...
      //NOTE: this match doesn't work :()
      let isbn = query.match('/\b(97(8|9))?d{9}(d|X)\b/');
      if (isbn != null) {
        console.log('OASEARCHREFERENCE isbn MATCH!', isbn[0]);
        data.isbn = isbn[0];
      } else {
        //try PMID
        let pmid = query.match(/\b(PMC)?(\d{3,})\b/);
        if (pmid != null) {
          console.log('OASEARCHREFERENCE PMID MATCH!', pmid[0]);
          data.pmid = pmid[0];
          //dispatch(requestFindReferenceByPMID(pmid[0]))
        }
      }
    }
    if (data.pmid == null && data.doi == null && data.isbn == null) {
      //base search by exact title: remove all commas and add quotes for exact title
      data.title = `"${query.replace(/,/g, '')}"`;
    }

    if (data && (data.pmid || data.doi || data.title))
      dispatch(requestFindOA(data));
    else if (data && data.isbn) {
      console.log('OASEARCHREFERENCE TODO SEARCH BY ISBN:', data.isbn);
      //dispatch(requestFindISBN(data.isbn))...
    }
  };

  /*Parsing da PUBMED
    const parsePMIDdoi = (ids) => {
        let doi=''
        
        ids.map( articleid => {
            if(articleid.idtype==='doi')
                doi=articleid.value

        })
        return doi;
    }
   
    const parseFromPubmed = (metadata) => {
        let obj={}

        let pubtype=metadata.pubtype?metadata.pubtype.toString().toLowerCase():null;
        
        obj={
            pmid: metadata.uid,
            pub_title: metadata.fulljournalname?metadata.fulljournalname:metadata.booktitle?metadata.booktitle:'',
            part_title: metadata.title,
            part_authors: metadata.authors?parseAuthors(metadata.authors):'',
            abstract: metadata.abstract?metadata.abstract:'',
            volume: metadata.volume?metadata.volume:'',
            issue: metadata.issue?metadata.issue:'',
            pubyear:  metadata.pubdate?metadata.pubdate.match(/\b(\d{4})\b/)[0]:'',
            pages: metadata.pages?metadata.pages:'', 
            material_type: pubtype==null? 0:( pubtype.includes('article')||pubtype.includes('review'))?1:(pubtype.includes('book')||pubtype.includes('biography')||pubtype.includes('diary'))?2:0,
            issn: metadata.issn?metadata.issn:'',
            isbn: metadata.isbn?metadata.isbn:'',
            publisher: metadata.publishername?metadata.publishername:'',
            publishing_place: metadata.publisherlocation?metadata.publisherlocation:'',
            doi: metadata.articleids?parsePMIDdoi(metadata.articleids):'',
        }
        
        return obj;
    }*/

  useEffect(() => {
    console.log('OASEARCHREFERENCE oareference changed, useEffect triggered', oareference);
    if (/*isMounted && */ oareference && Object.keys(oareference).length > 0) {
      console.log(
        "OASEARCHREFERENCE parsing del ref con i dati presi dall'OAButton API!",
        oareference,
      );

      // Check if there at least one result is found
      if (oareference.meta.count > 0) {
        // If FOUND, set send data to parseFromOpenAlex
        const newref = parseFromOpenAlex(oareference);
        setFound(newref);
      } else {
        // If not FOUND, set found to oareference (which contains meta.count=0)
        setFound(oareference);
      }
    }
  }, [oareference]);

  useEffect(() => {
    console.log('OASEARCHREFERENCE found changed', found);

    if (found != null) {
      //clean
      dispatch(cleanImportedreference());

      if (Object.keys(found).length > 0) {
        if (onFound) onFound(found);
      } else if (onNotFound) {
        onNotFound();
      }
    }
  }, [found]);

  return (
    <OASearchReferenceForm
      searchCallBack={query => findReferenceBySearchParams(query)}
      goToForm={goToForm}
      isLoading={isLoading}
      oareference={found}
      showReference={showReference}
    />
  );
};

const mapStateToProps = createStructuredSelector({
  isLoading: isOASearchReferenceLoading(),
  oasearchreference: makeSelectOASearchReference(),
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

export default compose(withConnect)(OASearchReference);
