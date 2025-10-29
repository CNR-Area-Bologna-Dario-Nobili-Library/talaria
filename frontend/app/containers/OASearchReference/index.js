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
import { parseAuthors } from '../../utils/openurl';

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
    console.log("GIOCOCONFOUND settato a null", found);

    let data = {};

    //try DOI
    let doi = query.match(/\b((10\.\d{4,9}\/[-._;()/:A-Z0-9a-z]+))/);
    if (doi != null) {
      console.log('OASEARCHREFERENCE DOI MATCH!', doi[0]);
      data.doi = doi[0];
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
      //base search by title
      data.title = query;
    }

    if (data && (data.pmid || data.doi || data.title))
      dispatch(requestFindOA(data));
    else if (data && data.isbn) {
      console.log('OASEARCHREFERENCE TODO SEARCH BY ISBN:', data.isbn);
      //dispatch(requestFindISBN(data.isbn))...
    }
  };

  const parseFromOAButton = reference => {
    console.log('OASEARCHREFERENCE parseFromOAButton', reference.metadata);

    let obj = {};

    if (reference.metadata && Object.keys(reference.metadata).length > 2) {
      let metadata = reference.metadata;

      //default:
      let pubtype = 1;

      //NOTA: le api di OpenAccessButton gestiscono solo articoli!
      //Specifica metadati: https://dev.api.cottagelabs.com/service/oab/metadata/keys

      console.log(
        'OASEARCHREFERENCE parsefromoabutton provo a capire il tipo di pubblicazione',
      );

      if (metadata.crossref_type) {
        console.log(
          'OASEARCHREFERENCE parsefromoabutton crossref_type:',
          metadata.crossref_type,
        );
        let tystr = metadata.crossref_type.toString().toLowerCase();
        if (tystr.includes('journal')) pubtype = 1;
        else if (tystr.includes('book')) pubtype = 2;
        /*else if(tystr.includes('thesis'))
              pubtype=3; */
      } else {
        console.log(
          'OASEARCHREFERENCE parsefromoabutton no crossref_type',
          metadata.journal,
          metadata.book,
          metadata.isbn,
        );
        //try to guess from fields
        if (metadata.journal) pubtype = 1;
        else if (metadata.isbn || metadata.book) pubtype = 2;
      }

      obj = {
        pub_title:
          pubtype == 1
            ? metadata.journal
            : metadata.title
            ? metadata.title
            : '',
        part_title: pubtype == 1 ? metadata.title : '',
        authors:
          (!pubtype || pubtype != 1) && metadata.author
            ? parseAuthors(metadata.author)
            : '',
        part_authors:
          pubtype == 1 && metadata.author ? parseAuthors(metadata.author) : '',
        abstract: metadata.abstract ? metadata.abstract : '',
        pubyear: metadata.year,
        volume: metadata.volume ? metadata.volume : '',
        issue: metadata.issue ? metadata.issue : '',
        pages: metadata.pages
          ? metadata.pages
          : metadata.page
          ? metadata.page
          : '',
        material_type: pubtype,
        issn: metadata.issn ? String(metadata.issn) : '',
        isbn: metadata.isbn ? metadata.isbn : '',
        publisher: metadata.publisher ? metadata.publisher : '',
        publishing_place: '',
        doi: metadata.doi ? metadata.doi : '',
        pmid: metadata.pmid ? metadata.pmid : '',
        oa_link: reference.url /*&& Object.keys(reference.metadata).length>0 &&*/
          ? reference.url
          : null,
      };
    }

    console.log('OASEARCHREFERENCE parseFromOAButton', obj);
    return obj;
  };

  /**
   * Determine publication type
   * @param {Object} reference 
   * @returns Publication type
   */
  const determinePubType = reference => {
    // Default publication type to article (1)
    let pubtype = 1;

    // If crossref-type contains one of these words, then it is a book (2)
    const bookWords = ['book', 'report', 'series', 'monograph', 'proceedings', 'standard'];
    if (bookWords.some(word => reference.type_crossref.includes(word))) {
      pubtype = 2;
    }

    // If the reference type is a dissertation, set pubtype to thesis (3)
    if (reference.type_crossref.includes('dissertation')) {
      pubtype = 3;
    }

    return pubtype;
  }

  /**
 * OpenAlex API returns inverted index for abstract so we need to decode it
 * @param {Array} invertedIndex 
 * @returns Abstract decoded from the inverted index
 */
  const decodeInvertedIndex = invertedIndex => {
    if (!invertedIndex || Object.keys(invertedIndex).length === 0) {
    return '';
    }

    // Find max position to determine array size
    let maxPosition = 0;
    Object.values(invertedIndex).forEach(positions => {
    const max = Math.max(...positions);
    if (max > maxPosition) {
        maxPosition = max;
    }
    });

    // Array to hold words at their position
    const wordsArray = new Array(maxPosition + 1);

    // Place each word at its position
    Object.entries(invertedIndex).forEach(([word, positions]) => {
    positions.forEach(position => {
        wordsArray[position] = word;
    });
    });

    // Join words into a string
    return wordsArray.join(' ');
  }

  const parseFromOpenAlex = oareference => {
    // Take the first result
    const reference = oareference.results[0];
    let obj = {};

    // Determine publication type
    const pubtype = determinePubType(reference);
    
    const location = reference.primary_location;
    const bib = reference.biblio;

    // pubTitle is the name of the journal if pubtype is 1 OR the book title if pubtype is 2
    const pubTitle = pubtype === 1 || pubtype === 2 ? location && location.source && location.source.display_name : reference.title;

    // partTitle is the article title only if pubtype is 1 OR is the book chapter title if pubtype is 2
    const partTitle = pubtype === 1 || pubtype === 2 && reference.title ? reference.title : '';

    const trimmedDoi = reference.ids.doi ? reference.ids.doi.replace('https://doi.org/', '') : '';
    const trimmedPmid = reference.ids.pmid ? reference.ids.pmid.replace('https://pubmed.ncbi.nlm.nih.gov/', '') : '';

    console.log('PARSEAUTHORS', parseAuthors(reference.authorships));

    obj = {
      pub_title: pubTitle,
      part_title: partTitle,
      authors: pubtype === 3 && reference.authorships ? parseAuthors(reference.authorships) : '',
      part_authors: pubtype === 1 || pubtype === 2 && reference.authorships ? parseAuthors(reference.authorships) : '',
      abstract: reference.abstract_inverted_index ? decodeInvertedIndex(reference.abstract_inverted_index) : '',
      pubyear: reference.publication_year,
      volume: bib.volume ? bib.volume : '',
      issue: bib.issue ? bib.issue : '',
      pages: bib.first_page && reference.biblio.last_page ? reference.biblio.first_page + ( reference.biblio.first_page !== reference.biblio.last_page ? '-' + reference.biblio.last_page : '' ) : '',
      material_type: pubtype,
      issn: location && location.source && location.source.issn ? location.source.issn[0] : '', // Take the first ISSN
      issn_l: location && location.source && location.source.issn_l ? location.source.issn_l : '',
      isbn: '',
      publisher: location && location.source && location.source.host_organization_name ? location.source.host_organization_name : '',
      publishing_place: '',
      doi: trimmedDoi,
      pmid: trimmedPmid,
      oa_link: reference.open_access.is_oa && reference.open_access.oa_url ? reference.open_access.oa_url : null,
      // sid: "OpenAlex",
    };

    console.log('OGGETTONE', obj);

    return obj
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
