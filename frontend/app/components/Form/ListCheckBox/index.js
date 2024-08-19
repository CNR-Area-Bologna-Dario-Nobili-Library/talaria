import React,{useEffect, useState} from 'react'
import {CustomInput, Row} from 'reactstrap'
import { requestApplyLabelsToReferences } from '../../../utils/api'

const ListCheckBox = (props) => {
    //console.log('ListCheckBox', props)
    const {data, type, handleChange, selectedData,disabled} = props
    
    const [formData, setFormData] = useState(selectedData)

    const handleFormData = (e, item) => {
        if(e.target.checked){
           handleChange([...formData, item.value])
        }else{            
            var index = selectedData.indexOf(item.value)
            selectedData.splice(index, 1);            
            handleChange(formData.filter(id => id!==item.value))
        } 
        //console.log("Projectids"+ JSON.stringify(selectedData))        
    }
    useEffect(() => {
       setFormData(selectedData)
    }, [selectedData])

    return (
        <>
           <div className="d-flex flex-wrap">
                {
                    formData && data && data.map(item => 
                        type === 'checkbox' &&
                        <CustomInput
                            key={item.value}
                            className="col-sm-4"
                            id={item.value}
                            disabled={disabled}
                            type={type}
                            name={item.label}
                            label={item.label}
                            onChange={(e) => handleFormData(e, item)}
                            checked={formData.includes(item.value)}
                        />   
                    )
                }
            </div> 
        </>
    )
}

export default ListCheckBox