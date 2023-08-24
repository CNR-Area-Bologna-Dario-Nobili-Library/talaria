export const fields = {
    name: {
        type: "text",
        required: false,
        name: "name",
        width: "col-md-4 col-sm-12",
        order: 1,
    },   

    profile_type: {
        type: "custom-select",
        required: false,
        name: "profile_type",
        width: "col-md-4 col-sm-12",    
        options: "profile_type",
        order: 2,
    },


    status: {
        type: "custom-select",
        required: false,
        name: "status",
        width: "col-md-4 col-sm-12",    
        options: "status",
        order: 3,
    },

    institution_type_id: {
        type: "custom-select",
        required: false,        
        name: "institution_type_id",
        width: "col-md-4 col-sm-12",     
        options: "institution_type_id",
        order: 4,        
    },

    country_id: {
        type: "custom-select",
        required: false,
        name: "country_id",
        width: "col-md-4 col-sm-12",    
        options: "country_id",
        order: 5,
    },

    subject_id: {
        type: "custom-select",
        required: false,
        name: "subject_id",
        width: "col-md-4 col-sm-12",       
        options: "subject_id",
        order: 6,
    },  

    identifier_type_id: {
        type: "custom-select",
        required: false,
        name: "identifier_type_id",
        width: "col-md-4 col-sm-12",        
        options: "identifier_type_id",
        order: 7,
    },

    identifier_code: {
        type: "text",
        required: false,
        name: "identifier_code",
        width: "col-md-4 col-sm-12",        
        options: "identifier_code",
        order: 8,
    }
    
}