import request from "./request";

import {BASE_URL,getOption} from './api';

const BASE_ADMIN_URL=BASE_URL+"/api/v1/admin";

// Libraries //
export const admin_getLibrariesList = (options) => {
  const page = options.page?options.page:1;
  const pageSize = options.pageSize?options.pageSize:20;
  const query = options.query?options.query:'';    
  const profileType=options.profile_type?options.profile_type:''
  const country=options.country?options.country:''
  const institution_type=options.institution_type?options.institution_type:''
  const status=options.status?options.status:''
  const subject=options.subject?options.subject:''
  const identifier_type=options.identifier_type?options.identifier_type:''
  const identifier_code=options.identifier_code?options.identifier_code:''

  options = getOption(options);
  return request(`${BASE_ADMIN_URL}/libraries/?page=${page}&pageSize=${pageSize}&status=${status}&profile_type=${profileType}&country=${country}&subject=${subject}&institution_type=${institution_type}&identifier_type=${identifier_type}&identifier_code=${identifier_code}&q=${query}`, options)
  };

export const admin_deleteLibrary = (options) => {
    const library_id = options.id
    options = getOption(options);
    return request(`${BASE_ADMIN_URL}/libraries/${library_id}`, options)
  };
  

export const admin_statusChangeLibrary = (options) => {
  const library_id = options.library_id
  
  options = getOption(options);  
  return request(`${BASE_ADMIN_URL}/libraries/${library_id}/changestatus`, options) 
}

export const admin_getLibrary = (options) => {
  const library_id = options.id
  options = getOption(options);
  const extra=(options.includes)?','+options.includes:''
  const fullincludes='granted_permissions'+extra;

  return request(`${BASE_ADMIN_URL}/libraries/${library_id}?include=${fullincludes}`, options)
};

export const admin_updateLibrary = (options) => {
  const library_id = options.body.id
  options = getOption(options);
  return request(`${BASE_ADMIN_URL}/libraries/${library_id}?include=granted_permissions,institution,country,departments`, options)
};

// Institutions //
export const admin_getInstitutionsList = (options) => {
  const page = options.page?options.page:1;
  const pageSize = options.pageSize?options.pageSize:20;
  const query = options.query?options.query:'';    
  const country=options.country?options.country:''
  const institution_type=options.institution_type?options.institution_type:''
  const status=options.status?options.status:''
  
 
  options = getOption(options);
  return request(`${BASE_ADMIN_URL}/institutions/?page=${page}&pageSize=${pageSize}&status=${status}&country=${country}&institution_type=${institution_type}&q=${query}`, options)  

};

export const admin_updateInstitution = (options) => {
  const institution_id = options.body.id
  options = getOption(options);
  return request(`${BASE_ADMIN_URL}/institutions/${institution_id}?include=granted_permissions`, options)
};

export const admin_createInstitution = (options) => {
  options = getOption(options);
  return request(`${BASE_ADMIN_URL}/institutions`, options)
};

export const admin_statusChangeInstitution = (options) => {
  const institution_id = options.institution_id
  
  options = getOption(options);  
  return request(`${BASE_ADMIN_URL}/institutions/${institution_id}/changestatus`, options) 
}


export const admin_deleteInstitution = (options) => {
  const institution_id = options.id
  options = getOption(options);
  return request(`${BASE_ADMIN_URL}/institutions/${institution_id}`, options)
};

export const admin_getInstitutionsByTypeByCountryOptionList = (options) => {
  options = getOption(options);
  const query = options.query;
  const countryid = options.countryid;
  const institutiontypeid = options.institutiontypeid;  
  return request(`${BASE_ADMIN_URL}/institutions/option-items/?label=name&country_id=${countryid}&institution_type_id=${institutiontypeid}`, options)
};

export const admin_getInstitution = (options) => {
  const institution_id = options.id
  options = getOption(options);
  return request(`${BASE_ADMIN_URL}/institutions/${institution_id}`, options)
};

export const admin_getInstitutionType = (options) => {
  const institution_id = options.id
  options = getOption(options);
  return request(`${BASE_ADMIN_URL}/institutions/institution-types/${institution_id}`, options)
};



export const admin_updateInstitutionType = (options) => {
  const institution_type_id = options.body.id
  options = getOption(options);
  return request(`${BASE_ADMIN_URL}/institutions/institution-types/${institution_type_id}`, options)
};

export const admin_createInstitutionType = (options) => {
  options = getOption(options);
  return request(`${BASE_ADMIN_URL}/institutions/institution-types`, options)
};


export const admin_deleteInstitutionType = (options) => {
  const institution_type_id = options.id
  options = getOption(options);
  return request(`${BASE_ADMIN_URL}/institutions/institution-types/${institution_type_id}`, options)
};

// Stats //
export const admin_getAvgWorkingTime = (options) => {
  options = getOption(options);
  console.log("admin_getAvgWorkingTime", options);
  const year = options.year  
  // return request(`${BASE_ADMIN_URL}/stats/avg-working-time`, options)
  return request(`${BASE_ADMIN_URL}/stats/avg-working-time/${year ? `?year=${year}` : ''}`, options)
}

export const admin_getBorrowingRequests = (options) => {
  options = getOption(options);
  // console.log("admin_getBorrowingRequests", options);

  const year = options.year;
  const borrowing_library_id = options.borrowing_library_id;
  const material_type = options.material_type;
  const borrowing_status = options.borrowing_status;
  const fulfill_type = options.fulfill_type;
  const notfulfill_type = options.notfulfill_type;

  const queryParams = new URLSearchParams();

  if (year) { queryParams.append('year', year); }
  if (borrowing_library_id) { queryParams.append('borrowing_library_id', borrowing_library_id); }
  if (material_type) { queryParams.append('material_type', material_type); }
  if (borrowing_status) { queryParams.append('borrowing_status', borrowing_status); }
  if (fulfill_type && borrowing_status === 2) { queryParams.append('fulfill_type', fulfill_type); }
  if (notfulfill_type && borrowing_status === 3) { queryParams.append('notfulfill_type', notfulfill_type); }

  // console.log("admin_getBorrowingRequests", queryParams.toString());
  return request(`${BASE_ADMIN_URL}/stats/borrowing-requests-stats/?${queryParams.toString()}`, options)
}