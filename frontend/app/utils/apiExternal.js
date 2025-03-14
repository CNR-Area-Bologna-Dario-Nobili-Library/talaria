import request from "./request";

const PMID_API_URL=process.env.PMID_API_URL
                    
const OPENACCESSBUTTON_API_URL=process.env.OPENACCESSBUTTON_API_URL

const OPENSTREETMAP_API_URL=process.env.OPENSTREETMAP_API_URL

const FIND_ISSN_SERVICE_URL=process.env.FIND_ISSN_SERVICE_URL

const FIND_ISBN_SERVICE_URL=process.env.FIND_ISBN_SERVICE_URL

const FIND_ISSN_ACNP_URL=process.env.FIND_ISSN_ACNP_URL




//Get PMID Metadata using OpenAccessButton API
export const getOAReferenceByID = (options) => {
    const id=options.id
    return request(`${OPENACCESSBUTTON_API_URL}/find?pmid=${id}`,  {method: 'get'})
};

//Find OA and get metadata by DOI/PMID/Title
export const getOA = (options) => {
    console.log("API GETOA:",options.refData)
    let query=options.refData.title?'id='+options.refData.title:''; //3

    if(options.refData.pmid) //2
    {      
      if(options.refData.pmid.toLowerCase().startsWith('pmc'))
        query='id='+options.refData.pmid; 
      else 
        query='pmid='+options.refData.pmid;

    }
    if(options.refData.doi) query='id='+options.refData.doi; //1
    

    return request(`${OPENACCESSBUTTON_API_URL}/find?${query}`,  {method: 'get'})
};

//Metadata using Pubmed API and PMID
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