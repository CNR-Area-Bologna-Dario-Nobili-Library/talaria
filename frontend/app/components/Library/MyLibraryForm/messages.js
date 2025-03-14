/*
 * Library Form
 *
 * This contains all the text for the HomePage container.
 */
import { defineMessages } from 'react-intl';

export const scope = 'app.components.LibraryForm';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'Library form',    
  },
  alt_name: {
    id: 'app.libraries.alt_name',
    defaultMessage: "Alternative name",
  },
  institution_id: {
    id: `app.libraries.institution_id`,
    defaultMessage: "Institution ID",
  },
  project_id: { 
    id: 'app.libraries.institution_id',
    defaultMessage: "Institution ID",
  },

  projects_label: {
    id: 'app.libraries.projects_label',
    defaultMessage: 'Project or Consortium',
  },

  identifiers_label: {
    id: 'app.libraries.identifiers_label',
    defaultMessage: 'Identifiers',
  },
  subject_id: {
    id: `app.libraries.subject_id`,
    defaultMessage: 'Subject ID',
  },

  subject_name: {
    id: 'app.libraries.subject_name',
    defaultMessage: 'subject_name',
  },

  library_coordinates_Validity: {
    id: 'app.libraries.library_coordinates_Validity',
    defaultMessage: "The latitude or longitude can be accepted in either decimal format (e.g., +33.56, -33.56) or in degrees format (e.g., 40°20'38''N).",
  },
  country_id: {
    id: `app.global.country`,
    defaultMessage: 'Country ID',
  },
  
  opac: {
    id: `app.libraries.opac`,
    defaultMessage: 'Url opac',
  },
  ill_email: {
    id: `app.libraries.ill_email`,
    defaultMessage: 'Email LL service',
  },
  ill_phone: {
    id: `app.libraries.ill_phone`,
    defaultMessage: 'Phone LL service',
  },
  ill_supply_conditions: {
    id: `app.libraries.ill_supply_conditions`,
    defaultMessage: 'Supply conditions',
  },
  ill_imbalance: {
    id: `app.libraries.ill_imbalance`,
    defaultMessage: 'Imbalance',
  },
  ill_susp_date_start: {
    id: `app.libraries.ill_susp_date_start`,
    defaultMessage: 'Susp start date',
  },
  ill_susp_date_end: {
    id: `app.libraries.ill_susp_date_end`,
    defaultMessage: 'Susp end date',
  },
  ill_susp_notification_days: {
    id: `app.libraries.ill_susp_notification_days`,
    defaultMessage: 'Susp notice days',
  },
  ill_cost: {
    id: `app.libraries.ill_cost`,
    defaultMessage: 'ill_cost',
  },
  ill_user_cost: {
    id: `app.libraries.ill_user_cost`,
    defaultMessage: 'ill_user_cost',
  },
  status: {
    id: `app.libraries.status`,
    defaultMessage: 'status',
  },
  external: {
    id: `app.libraries.external`,
    defaultMessage: 'external',
  },

  profile_type: { 
    id: 'app.libraries.profile_type',
    defaultMessage: 'profile_type',
  },

  registration_date: {
    id: `app.libraries.registration_date`,
    defaultMessage: 'Registration date',
  },
  vatnumber: {
    id: `app.global.vatnumber`,
    defaultMessage: 'PIVA',
  },
  fiscalcode: {
    id: `app.global.fiscalcode`,
    defaultMessage: 'CF',
  },
  invoice_header: {
    id: `app.global.invoice_header`,
    defaultMessage: 'invoice_header',
  },
  registration_date: {
    id: 'app.libraries.registration_date',
    defaultMessage: 'Registration date',
  },
  email_pec: {
    id: `app.global.email_pec`,
    defaultMessage: 'email_pec',
  },
  ccu: {
    id: `app.global.ccu`,
    defaultMessage: 'ccu',
  },
  administrative: {
    id: `app.global.administrative`,
    defaultMessage: 'administrative',
  },
  administrative_email: {
    id: `app.global.administrative_email`,
    defaultMessage: 'administrative_email',
  },
  administrative_phone: {
    id: `app.global.administrative_phone`,
    defaultMessage: 'administrative_phone',
  },
  terzo_code: {
    id: `app.global.terzo_code`,
    defaultMessage: 'terzo_code',
  },
  general_info: {
    id: `app.libraries.general_info`,
    defaultMessage: 'General info',
  },
  service_info: {
    id: 'app.libraries.service_info',
    defaultMessage: 'Service info',
  },
  administrative_info: {
    id: `app.global.administrative_info`,
    defaultMessage: 'Administrative Info',
  },
  institution_info: {
    id: 'app.libraries.institution_info',
    defaultMessage: 'Institution and Projects',
  },
  identifier_info: {
    id: 'app.libraries.identifiers_label',
    defaultMessage: 'Identifiers',
  },
  identifier_type_id: {
    id: 'app.libraries.identifier_type_id',
    defaultMessage: 'Identifier Type',
  },

  library_identifiers_txt: {
    id: 'app.libraries.identifier_code',
    defaultMessage: 'Identifier Code',
  },
  
  /*granted_permissions: {
    id: `app.libraries.granted_permissions`,
    defaultMessage: 'Users permissions',
  },*/

  updateSubmitText: {
    id: `${scope}.updateSubmitText`,
    defaultMessage: 'Update Reference',
  },
  createSubmitText: {
    id: `${scope}.createSubmitText`,
    defaultMessage: 'Create Reference',
  },

  institution_type_id: {
    id: 'app.libraries.institution_type_id',
    defaultMessage: 'Institution Type ID',
  },

  institution_country_id: {
    id: 'app.libraries.institution_country_id',
    defaultMessage: 'Institution Country ID',
  },


alt_name: {
  id: 'app.libraries.alt_name',
  defaultMessage: 'Alternative name',
},

suggested_institution_name: {
  id: 'app.libraries.suggested_institution_name',
  defaultMessage: 'Your institution Name',
},

  ill_IFLA_voucher: {
    id: 'app.libraries.ill_IFLA_voucher',
    defaultMessage: 'IFLA voucher accepted'
  },
  ill_cost_in_voucher: {
    id: 'app.libraries.ill_cost_in_voucher',
    defaultMessage: 'IFLA voucher value'
  },
  
});

