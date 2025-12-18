import request from "./request";

const PMID_API_URL=process.env.PMID_API_URL
                    
const OPENALEX_API_URL=process.env.OPENALEX_API_URL

const TECH_SUPPORT_EMAIL=process.env.TECH_SUPPORT_EMAIL

const OPENSTREETMAP_API_URL=process.env.OPENSTREETMAP_API_URL

const FIND_ISSN_SERVICE_URL=process.env.FIND_ISSN_SERVICE_URL

const FIND_ISBN_SERVICE_URL=process.env.FIND_ISBN_SERVICE_URL

const FIND_ISSN_ACNP_URL=process.env.FIND_ISSN_ACNP_URL

//Get PMID Metadata using OpenAlex API
export const getOAReferenceByID = (options) => {
  const id=options.id
  return request(`${OPENALEX_API_URL}/works?filter=pmid:${id}`,  {method: 'get'})
}

//Find OA and get metadata by DOI/PMID/Title
export const getOA = (options) => {
  console.log("API GETOA - OPENALEX:", options.refData);
  
  let filter = '';
  
  if (options.refData.doi) {
    filter = `doi:${options.refData.doi}`;
  } else if (options.refData.pmid) {
    console.log("API GETOA - OPENALEX - PMID:", options.refData.pmid);
    filter = `pmid:${options.refData.pmid}`;
  } else if (options.refData.title) {
    filter = `title.search:${options.refData.title}`;
  }
  
  console.log("API GETOA - OPENALEX - FILTER:", filter);
  console.log("API GETOA - OPENALEX - URL:", `${OPENALEX_API_URL}/works?filter=${encodeURIComponent(filter)}&mailto=${TECH_SUPPORT_EMAIL}`);

  return request(
    `${OPENALEX_API_URL}/works?filter=${encodeURIComponent(filter)}&mailto=${TECH_SUPPORT_EMAIL}`,
    { method: 'get' }
  );
};

//Metadata using Pubmed API and PMID
//! Not used
export const getPubmedReferenceByPMID = (options) => {
    const pmid=options.pmid
    //return request(`${PMID_API_URL}?db=pubmed&retmax=1&retmode=json&tool=my_tool&email=my_email@example.com&id=${pmid}`,  {method: 'get'})
    return request(`${PMID_API_URL}?db=pubmed&retmax=1&retmode=json&id=${pmid}`,  {method: 'get'})
};

export const getPlacesByText = (options) => {
    let query=options.search
    return request(`${OPENSTREETMAP_API_URL}/search?format=json&q=${query}`,  {method: 'get'})
}

export const getFindISSN = (options) => {
  console.log("getFindISSN",options)
    const title=options.title
    const year=options.year
    const issn=options.issn
2
    return request(`https://mocki.io/v1/c821d667-f677-4e9e-aab4-8f23dd998f89`,  {method: 'get'}) 

    //return request(`${FIND_ISSN_SERVICE_URL}/xxxx?issn=${issn}&title=${title}&year=${year}`,  {method: 'get'})
    const result = {    
        'data': [
          {'issn': '1749-4893', 'issn_l': '1749-4893','pub_title': 'Nature Photonics' },
          {'issn': '1948-5875', 'pub_title': 'ACS medicinal chemistry letters' },
        ]
      }; 
      console.log("getFindISSN results",result);
    return result;  
};

export const getFindISSN_ACNP = (options) => {
    const title=options.title
    const year=options.year
    const issn=options.issn
    //return request(`${FIND_ISSN_ACNP_URL}/xxxx?issn=${issn}&title=${title}&year=${year}`,  {method: 'get'})
    const result = {    
        'data': [
          {'issn': '9999-9999', 'pub_title': 'acnpTitle99' },
          {'issn': '8888-8888', 'pub_title': 'acnpTitle88' },
        ]
      }; 
      console.log("getFindISSN_ACNP results",result);  
    return result;
};

export const getFindISBN = (options) => {
    const booktitle=options.booktitle
    //return request(`${FIND_ISBN_SERVICE_URL}/xxxx?booktitle=${booktitle}`,  {method: 'get'})
    const result = {    
        'data': [
          {'isbn': '999999999999','sbn_docid':'aaaaaaaaaaaaaaa', 'pub_title': 'sbnTitle99' },
          {'isbn': '888888888888','sbn_docid':'bbbbbbbbbbbbbbb', 'pub_title': 'sbnTitle88' },
        ]
      }; 
    console.log("getFindISBN results",result);  
    return result;
};

/**
 * Truncate list of authors to maxChars (default 100 chars) and add 'et al.'
 * @param {Array} authors Array of authors
 * @param {number} maxChars Number of chars
 * @returns 
 */
export const parseAuthors = (authors, maxChars = 100) => {
  if (!authors || !Array.isArray(authors)) {
      return '';
  }

  const ET_AL = ' et al.';

  // Get authors display name
  const validAuthors = authors
      .map(a => a.author && a.author.display_name ? a.author.display_name : '')

  // If all authors fit, return them all
  const allAuthors = validAuthors.join(', ');
  if (allAuthors.length <= maxChars) {
      return allAuthors;
  }

  // Otherwise, add authors one by one until we hit the limit
  let result = '';
  for (let i = 0; i < validAuthors.length; i += 1) {
      const authorToAdd = i === 0 ? validAuthors[i] : ', ' + validAuthors[i];
      const potentialResult = result + authorToAdd + ET_AL;

      if (potentialResult.length > maxChars) {
          // Can't fit this author. Use previous result with "et al."
          return result + ET_AL;
      }

      result += authorToAdd;
  }

  // Fallback
  return result + ET_AL;
}

/**
 * Determine publication type
 * @param {Object} reference 
 * @returns Publication type
 */
const determinePubType = reference => {
  if (!reference || !reference.type) {
    return null;
  }
  
  // Default publication type to article (1)
  let pubtype = null;

  // const crossref_articleWords = ['journal', 'peer-review'];
  const articleWords = ['article', 'dataset', 'review', 'preprint', 'letter', 'editorial', 'erratum', 'supplementary-materials', 'retraction'];
  if (articleWords.some(word => reference.type.includes(word))) {
    pubtype = 1;
  }
  
  // If type contains one of these words, then it is a book (2)
  // const crossref_bookWords = ['book', 'report', 'series', 'monograph', 'proceedings', 'standard'];
  const bookWords = ['book', 'reference-entry', 'report', 'standard'];
  if (bookWords.some(word => reference.type.includes(word))) {
    pubtype = 2;
  }

  // If the reference type is a dissertation, set pubtype to thesis (3)
  if (reference.type.includes('dissertation')) {
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

export const parseFromOpenAlex = oareference => {
  // If there are no results, return null
  if (!oareference || !oareference.results || oareference.results.length === 0) {
    return null;
  }

  // Take the first result
  const reference = oareference.results[0];
  let obj = {};

  // Determine publication type
  const pubtype = determinePubType(reference);
  
  const location = reference.primary_location;
  const bib = reference.biblio;

  // pubTitle is the name of the journal if pubtype is 1 OR the book title if pubtype is 2
  let pubTitle;
  if (pubtype === 1 || pubtype === 2) {
    // Use location.raw_source_name for journal or book
    if (location && location.raw_source_name) {
      pubTitle = location.raw_source_name;
    } else if (location && location.source && location.source.display_name) { // Use location.source.display_name if location.raw_source_name is not available
      pubTitle = location.source.display_name;
    }
  } else {
    // Use reference title for other types
    pubTitle = reference.title;
  }

  // partTitle is the article title only if pubtype is 1 OR is the book chapter title if pubtype is 2
  const partTitle = pubtype === 1 || pubtype === 2 && reference.title ? reference.title : '';

  // Search for doi in reference.doi, if there is none, search for doi in reference.ids.doi
  const objDOI = reference.doi || (reference.ids && reference.ids.doi) || null;
  const trimmedDoi = objDOI ? objDOI.replace('https://doi.org/', '') : '';

  const trimmedPmid = reference.ids.pmid ? reference.ids.pmid.replace('https://pubmed.ncbi.nlm.nih.gov/', '') : '';

  console.log('PARSEAUTHORS', parseAuthors(reference.authorships));

  /**
   * IMPORTANT NOTE REGARDING SID
   * SID is set to "openalex.org" ONLY when data is retrieved from OpenAlex, that means that the user has to input a DOI, PMID, or Title and the data is from 
   * OpenAlex.
   * 
   * When data is inputted manually, no SID is set.
   * When data comes from openurl, SID is set only if it's included in the openurl.
   * When the user clicks on "Search OA", the SID is not overridden to "openalex.org" even if the OA check is made with OpenAlex.
   * */
  obj = {
    pub_title: pubTitle,
    part_title: partTitle,
    authors: pubtype === 3 && reference.authorships ? parseAuthors(reference.authorships) : '',
    part_authors: pubtype === 1 || pubtype === 2 && reference.authorships ? parseAuthors(reference.authorships, 200) : '',
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
    sid: "openalex.org",
  };

  console.log('OGGETTONE', obj);

  return obj
};