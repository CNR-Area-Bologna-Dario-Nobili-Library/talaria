export const fields = {
    name: {
        type: "text",
        required: false,
        name: "name",
        width: "col-md-4 col-sm-12",
        order: 1,
    },   

    country_id: {
        type: "custom-select",
        required: false,
        name: "country_id",
        width: "col-md-4 col-sm-12",    
        options: "country_id",
        order: 2,
        hasselect: true
    },

    institution_type_id: {
        type: "custom-select",
        required: false,        
        name: "institution_type_id",
        width: "col-md-4 col-sm-12",     
        options: "institution_type_id",
        order: 3,      
        hasselect: true
    },

    subject_id: {
        type: "custom-select",
        required: false,
        name: "subject_id",
        width: "col-md-4 col-sm-12",       
        options: "subject_id",
        order: 4,
        hasselect: true
    },

    

    identifier_type_id: {
        type: "custom-select",
        required: false,
        name: "identifier_type_id",
        width: "col-md-4 col-sm-12",        
        options: "identifier_type_id",
        order: 5,
        hasselect: true
    },

    identifier_code: {
        type: "text",
        required: false,
        name: "identifier_code",
        width: "col-md-4 col-sm-12",        
        options: "identifier_code",
        order: 6,
    }
    
}