export const fields = {
    name: {
        type: "text",
        required: false,
        name: "name",
        width: "col-md-4 col-sm-12",
        order: 1,
    },   

    status: {
        type: "custom-select",
        required: false,
        name: "status",
        width: "col-md-4 col-sm-12",    
        options: "status",
        order: 3,
        hasselect:true
    },

    institution_type_id: {
        type: "custom-select",
        required: false,        
        name: "institution_type_id",
        width: "col-md-4 col-sm-12",     
        options: "institution_type_id",
        order: 4,  
        hasselect:true      
    },

    country_id: {
        type: "custom-select",
        required: false,
        name: "country_id",
        width: "col-md-4 col-sm-12",    
        options: "country_id",
        order: 5,
        hasselect:true
    },    
}