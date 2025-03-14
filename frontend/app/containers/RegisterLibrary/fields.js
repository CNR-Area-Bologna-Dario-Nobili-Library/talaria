export const fieldsGroups = {
    step_1: {
        name: 'step_1',
        order: 0,
        label: 'general_info'
    },
    step_2: {
        name: 'step_2',
        order: 1,
        label: 'Summary Report'
    },
    step_3: {
        name: 'step_3',
        order: 2,
        label: 'administrative_info'
    },
};

export const totalSteps = 2;
export const setNewSteps = () => {
    let objectSteps = {}
    for(let i = 1; i <= totalSteps; i++){
        objectSteps[i] =  { active: i===1 ? true : false }
    }
    return objectSteps
}


export const fields = {


       
    library_location_label: {
        type: "Label",
        required: false,
        nolabel: true,
        paddingtop:"30px",
        name: "library_location_label",
        width: "col-sm-12",
        fontSize:"25px",
        group: "step_1",
        order: 1,
    },

    library_coordinates: {
        type: "ButtonMapPosition",
        label:"Click to get coords",
        name: "library_coordinates",
        color: "brown",
        width: "col-md-4",
        group: "step_1",
        disabled: false,
        order: 2,
    },
    library_coordinates_txt_lat: {
        type: "text",
        name: "lat",
        width: "col-md-3",
        group: "step_1",
        order: 3,
    },
    library_coordinates_txt_long: {
        type: "text",
        name: "lon",
        width: "col-md-3",
        group: "step_1",
        order: 4,
    },
    library_coordinates_note: {
        type: "Label",
        required: false,
        nolabel: true,
        name: "library_coordinates_note",
        width: "col-sm-4",
        fontSize:"13px",
        group: "step_1",
        order: 5,
    },

    library_coordinates_Validity: {
        type: "Label",
        required: false,
        nolabel: true,
        name: "library_coordinates_Validity",
        width: "col-sm-8",
        fontSize:"14px",
        group: "step_1",
        order: 6,
        hidden:true,
        color:"#FF0000",
        hasborder: false
    },
    geolocation_spinner: {
        type: "spinner",
        name: "geolocation_spinner",
        width: "col-md-2",
        hidden: true,
        group: "step_1",
        order: 6,
    },
    name: {
        type: "text",
        required: true,
        name: "name",
        width: "col-sm-12",
        group: "step_1",
        order: 7,
    },
    alt_name: {
        type: "text",
        required: false,
        name: "alt_name",
        width: "col-sm-12",
        group: "step_1",
        order: 8,
    },  
    url: {
        type: "text",
        required: true,
        name: "url",
        width: "col-sm-12",
        group: "step_1",
        order: 9,
    },
    country_id: {
        type: "custom-select",
        required: true,
        name: "country_id",
        width: "col-md-6",
        group: "step_1",
        options: "country_id",
        order: 10,
        hasselect: true
    },
    state: {
        type: "text",
        required: false,
        name: "state",
        label: 'app.global.state',
        placeholder: 'app.global.state',
        group: "step_1",
        width: "col-sm-6",
        order: 11,
    }, 
    town: {
        type: "text",
        required: true,
        name: "town",
        label: 'app.global.town',
        placeholder: 'app.global.town',
        group: "step_1",
        width: "col-sm-6",
        order: 12,
    },
    postcode: {
        type: "number",
        required: true,
        name: "postcode",
        label: 'app.global.postcode',
        placeholder: 'app.global.postcode',
        group: "step_1",
        width: "col-sm-6",
        order: 13,
    },
    address: {
        type: "text",
        required: true,
        name: "address",
        label: 'app.global.address',
        placeholder: 'app.global.address',
        group: "step_1",
        width: "col-sm-12",
        order: 14,
    },
   library_contact_label: {
        type: "Label",
        required: false,
        paddingtop:"30px",
        nolabel: true,
        name: "library_contact_label",
        width: "col-sm-12",
        fontSize:"25px",
        group: "step_1",
        order: 15,
    },
    ill_email: {
        type: "text",
        required: true,
        name: "ill_email",
        label: 'app.global.ill_email',
        group: "step_1",
        width: "col-sm-6",
        order: 16,
    },
    ill_phone: {
        type: "text",
        required: true,
        name: "ill_phone",
        label: 'ill_phone',
        group: "step_1",
        width: "col-sm-6",
        order: 17,
    },
    ill_institution_label: {
        type: "Label",
        required: false,
        paddingtop:"30px",
        fontSize:"25px",
        nolabel:true,
        name: "ill_institution_label",
        width: "col-sm-12",
        group: "step_1",
        order: 18,
    },
    institution_type_id: {
        type: "custom-select",
        required: true,
        name: "institution_type_id",
        width: "col-md-6",
        group: "step_1",
        options: "institution_type_id",
        order: 19,
        hasselect: false
       // selectedOption: "institution_type_id"
    },
    institution_country_id: {
        type: "custom-select",
        required: true,
        name: "institution_country_id",
        width: "col-md-6",
        group: "step_1",
        options: "institution_country_id",
        order: 20,
        selectedOption: "institution_country_id",
        hasselect: false
    },
    institution_id: {
        type: "custom-select",
        required: true,
        name: "institution_id",
        width: "col-sm-12",
        group: "step_1",
        options: "institution_id",
        order: 21,
        selectedOption: "id",
        hasselect: false
    },
    suggested_institution_name: {
        type: "text",
        required: false,
        name: "suggested_institution_name",
        group: "step_1",
        width: "col-sm-12",
        hidden: true,
        order: 22,
    },
    projects_label: {
        type: "Label",
        required: false,
        paddingtop:"30px",
        fontSize:"25px",
        name: "projects_label",
        nolabel:true,
        width: "col-sm-12",
        group: "step_1",
        order: 23,
    },
    project_id: {
        nolabel: true,
        type: "list-checkbox",
        name: "project_id",
        width: "col-sm-12",
        group: "step_1",
        required: true,
        order: 24,
        hasselect: false
    },

    identifiers_label: {
        type: "Label",
        required: false,
        paddingtop:"30px",
        fontSize:"25px",
        name: "identifiers_label",
        nolabel:true,
        width: "col-sm-12",
        group: "step_1",
        order: 25,
    },

    identifier_type_id: {
        type: "custom-select",
        //required: true,
        name: "identifier_type_id",
        width: "col-md-6",
        group: "step_1",
        options: "identifier_type_id",
        order: 26,
        hasselect: false
    },
 
    library_identifiers_txt: {
        type: "text",
        name: "library_identifiers_txt",
        width: "col-md-4",
        //required: true,
        group: "step_1",
        order: 27,
        
    },

    library_identifier_add: {
        type: "AddButton",
        label:"Add Code",
        name: "library_identifier_add",
        margintop:"13px",
        width: "col-md-2",
        group: "step_1",
        disabled: true,
        order: 28,
    },

    library_identifier_list: {
        type: "list",
        label:"Add",
        name: "library_identifier_list",
        hidden: true,
        width: "col-md-12",
        group: "step_1",
        order: 29,
    },

    identifiers_id: {
        type: "text",
        name: "identifiers_id",
        width: "col-md-3",
        group: "step_1",
        hidden:true,
        order: 30,
        hasselect: false
    },

    subject_label: {
        type: "Label",
        required: false,
        paddingtop:"30px",        
        fontSize:"25px",
        name: "subject_label",
        nolabel: true,
        width: "col-sm-12",
        group: "step_1",
        order: 31,
    },
    subject_id: {
        type: "custom-select",
        required: true,
        name: "subject_id",
        width: "col-sm-12",
        group: "step_1",
        options: "subject_id",        
        order: 32,
        hasselect: false
    },



    volunteer_library_label: {
        type: "Label",
        required: false,
        paddingtop:"30px",
        hidden: false,
        fontSize:"25px",
        name: "volunteer_library_label",
        nolabel: true,
        width: "col-sm-12",
        group: "step_1",
        order: 33,
    },    
    showfullProfile: {
        type: "Button",
        label:"Yes, Click here",
        color: "brown",
        name: "showfullProfile",
        width: "col-md-12",
        group: "step_1",
        order: 34,
    },    

    opac_label: {
        type: "Label",
        required: false,
        paddingtop:"30px",
        hidden: true,
        fontSize:"25px",
        name: "opac_label",
        nolabel: true,
        width: "col-sm-12",
        group: "step_1",
        order: 35,
    },
    opac: {
        type: "text",
        required: false,
        name: "opac",
        group: "step_1",
        width: "col-sm-12",
        hidden: true,
        order: 36,
    },
    ill_service_conditions: {
        type: "Label",
        required: false,
        fontSize:"25px",
        paddingtop:"30px",
        hidden: false,
        name: "ill_service_conditions",
        nolabel:true,
        width: "col-sm-12",
        group: "step_1",
        order: 37
    },
    ill_user_cost: {
        type: "number",
        required: false,
        name: "ill_user_cost",
        width: "col-sm-6",
        group: "step_1",
        order: 38,
    },
    ill_service_conditions_other: {
        type: "Label",
        required: false,
        fontSize:"25px",
        paddingtop:"30px",
        hidden: false,
        name: "ill_service_conditions_other",
        nolabel: true,
        width: "col-sm-12",
        group: "step_1",
        order: 39,
    },
    ill_cost: {
        type: "number",
        required: false,
        name: "ill_cost",
        width: "col-sm-6",
        group: "step_1",
        order: 40,
    },

    ill_imbalance: {
        type: "text",
        required: false,
        name: "ill_imbalance",
        width: "col-sm-6",
        group: "step_1",
        order: 41,
    },

    ill_supply_conditions: {
        type: "textarea",
        required: false,
        cols: 56,
        rows:7,
        name: "ill_supply_conditions",
        width: "col-sm-6",
        group: "step_1",
        order: 42,
    },

     
    ill_help_other: {
        type: "Label",
        required: false,
        fontSize:"20px",
        paddingtop:"100px",
        hidden: false,
        name: "ill_help_other",  
        nolabel:true,        
        width: "col-sm-12",
        group: "step_1",
        order: 43,
    },    
    country_name: {
        type: "text",
        name: "country_name",
        width: "col-md-6",
        order: 44,
        hidden:true
    },

    institution_country_name: {
        type: "custom-select",
        name: "institution_country_name",
        width: "col-md-6",
        order: 45,
        hidden:true
    },
}

