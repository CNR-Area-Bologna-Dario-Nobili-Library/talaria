export const fields = {
    name: {
        type: "text",
        name: "name",
        width: "col-md-12",
        disabled: true,
        order: 1
    },
    label: {
        type: "text",
        name: "label",
        width: "col-md-12",
        order: 2
    },
    preferred: {
        type: "switch",
        name: "preferred",
        width: "col-md-12",
        order: 3,
    },
    department_id: { 
        type: "custom-select",
        name: 'department_id',
        width: "col-md-12",
        options: 'department_id',
        order: 4
    },  
    title_id: { 
        type: "custom-select",
        name: 'title_id',
        width: "col-md-12",
        options: 'title_id',
        order: 5, 
    },
    user_referent: { 
        type: "text",
        name: 'user_referent',
        width: "col-md-12",
        order: 6, 
    },
    user_mat: { 
        type: "text",
        name: 'user_mat',
        width: "col-md-12",
        order: 6, 
    },
    user_service_phone: { 
        type: "text",
        name: 'user_service_phone',
        width: "col-md-12",
        order: 8, 
    },
    user_service_email: { 
        type: "email",
        name: 'user_service_email',
        width: "col-md-12",
        order: 9, 
    },
}

export const fieldsIsNew = { 
   library_id: { 
        type: "custom-select",
        name: 'library_id',
        width: "col-md-12",
        options: 'library_id',
    },
    department_id: { 
        type: "custom-select",
        name: 'department_id',
        width: "col-md-12",
        options: 'department_id',
        hidden: true,
    },  
    title_id: { 
        type: "custom-select",
        name: 'title_id',
        width: "col-md-12",
        options: 'title_id',
        hidden: true,
    },
}