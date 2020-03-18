import React, {useEffect, useState} from 'react'
import { Card, CardBody, CustomInput, Form, Button, Row } from 'reactstrap'
import PropTypes from 'prop-types';
import {useIntl} from 'react-intl'
import formMessages from './messages'
import Select from 'react-select';
import { AppSwitch } from '@coreui/react'
import './style.scss'
import {ErrorBox} from 'components';
import {selectFieldsGroups} from './selectFieldsGroups'
import moment from "moment";
// PROPS
// fields
// callback action
// classes

const CustomForm = (props) => {
    const {
        submitCallBack = () => null,
        title = 'Form',
        className = '',
        submitText = "Submit",
        submitColor = "brown",
        fields = {},
        searchCustomSelect = () => null,
        messages,
        updateFormData,
        fieldsGroups = {},
    } = props

    const intl = useIntl();
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true)
    
    const handleFormData = () => {
        let data = {}
        Object.keys(fields).map(key => {
            const field = fields[key]
            if(fields[key].type === 'checkbox' || fields[key].type === 'switch') {
                
                data = {...data, [key]: updateFormData && updateFormData[field.name] ? updateFormData[field.name]  : false }
            
            }else if(fields[key].type === 'custom-select'){
                
                const selectedOption = updateFormData && updateFormData[field.name] ?  props[field.name].filter(option => option.value === updateFormData[field.name])[0] : {label: intl.formatMessage(formMessages.select), value: 0}
                data = {...data, [key]: selectedOption }
            
            }else if(fields[key].type === 'select'){
                
                data = {...data, [key]: updateFormData && updateFormData[field.name]  ? updateFormData[field.name]  : fields[key].options[0].value }
            
            }else {
                
                data = {...data, [key]: updateFormData && updateFormData[field.name]  ? updateFormData[field.name]  : '' }
            
            }
        })
        return data
    }

    const [formData, setFormData] = useState(handleFormData())

    /* CUSTOM SELECT Handle */
    const handleSearchCustomSelect = (newValue, name) => {
        const inputValue = newValue.replace(/\W/g, '');
        if(typeof searchCustomSelect === 'object'){
            searchCustomSelect[name](inputValue)
        }else {
            searchCustomSelect(inputValue)
        }
        
    };

    const handleChangeCustomSelect = (selectedOption, key) => {
       console.log(selectedOption, key)
       setFormData({...formData, [key]:  {...selectedOption} })
       setIsSubmitDisabled(false)
    }


    /* HANDLE CHANGE Generico */
    const handleChange = (e) =>{
        const targetType = e.target.type
        const targetName = e.target.name;
        const targetChecked = e.target.checked;
        const targetValue = e.target.value;
        console.log(targetValue)
        switch(targetType) {
            case "checkbox":
                if(targetName !== 'privacy_policy_accepted'){
                    setFormData({ ...formData, [targetName]:  targetChecked })
                }else {
                    setFormData({ ...formData, [targetName]: moment().format('YYYY-MM-DD hh:mm:ss')  })
                }
                break;
            default:
                setFormData({ ...formData, [targetName]:  targetValue   })
                break;
        }
        setIsSubmitDisabled(false)
    }

    const onSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        form.classList.add('was-validated');
        if (form.checkValidity() === false) {
            console.log("Dont Send Form")
            return
        } else {
            submitCallBack(formData)
            console.log("Send Form", formData)
        }
        return
    }

    useEffect(() => {
       if(updateFormData){
            setFormData(handleFormData())
       }
    }, [updateFormData])

    return (
        Object.keys(fields).length &&
            (<Card className="card-form">
                <CardBody className="p-4">
                    { title !== "" ? <h2>{title}</h2> : '' }
                    <Form onSubmit={onSubmit} noValidate>
                        <div className="form-groups">
                            {selectFieldsGroups(fields,fieldsGroups).map((formfields) => {
                                // const field = fields[key];
                                return (<div key={formfields.name} className="form-group">
                                            {formfields.name !== 'undefined' &&
                                                <h4>{intl.formatMessage(messages[formfields.label])}</h4>
                                            }
                                            <Row>
                                                {formfields.fields.map((field, i) => {
                                                    return (
                                                        <fieldset key={`${field.name}-${i}`} className={`${field.width ? field.width : ""} mb-3`}>
                                                            <div className="form-label">
                                                                {messages[field.name] && intl.formatMessage(messages[field.name])}
                                                            </div>
                                                            {field.type === 'checkbox' &&
                                                                (<CustomInput
                                                                    className="form-control"
                                                                    id={field.name}
                                                                    type={field.type}
                                                                    name={field.name}
                                                                    label={messages[field.name] && intl.formatMessage(messages[field.name])}
                                                                    // value={formData[field.name]}
                                                                    onChange={(e) => handleChange(e)}
                                                                    required={field.required ? field.required : false}
                                                                    checked={formData[field.name]}
                                                                />)
                                                            ||
                                                            field.type === 'select' &&
                                                                ( <CustomInput
                                                                    className="form-control"
                                                                    id={field.name}
                                                                    type={field.type}
                                                                    placeholder={intl.formatMessage(messages[field.name])}
                                                                    name={field.name}
                                                                    value={formData[field.name]}
                                                                    onChange={(e) => handleChange(e)}
                                                                    required={field.required ? field.required : false}
                                                                >
                                                                {
                                                                    (typeof field.options === 'string') ?
                                                                    props[field.options] && props[field.options].map((opt, i) => (
                                                                            <option key={`${field.name}-${i}`} value={opt.value}>
                                                                                {opt.name}
                                                                            </option>)
                                                                        ) :
                                                                    field.options.map((opt, i) => (<option key={`${field.name}-${i}`} value={opt.value}>{opt.name}</option>))
                                                                }
                                                                </CustomInput>)
                                                            ||
                                                            field.type === 'custom-select' &&
                                                                (<Select
                                                                    className="form-custom-select"
                                                                    type="custom-select"
                                                                    value={formData[field.name]}
                                                                    name={field.name}
                                                                    onChange={(selectedOption) => handleChangeCustomSelect(selectedOption, field.selectedOption)}
                                                                    onInputChange={(input) => handleSearchCustomSelect(input, field.name)}
                                                                    options={props[field.options]}
                                                                    required
                                                                />)
                                                            ||
                                                            field.type === 'switch' &&
                                                                <AppSwitch className="mx-1" color="success"
                                                                    checked={Boolean(formData[field.name])}
                                                                    name={field.name}
                                                                    onChange={(e) => handleChange(e)}
                                                                    required={field.required ? field.required : false}
                                                                />
                                                            ||
                                                                (<CustomInput
                                                                    className="form-control"
                                                                    id={field.name}
                                                                    type={field.type}
                                                                    disabled={field.disabled ? field.disabled : false}
                                                                    placeholder={messages[field.name] && intl.formatMessage(messages[field.name])}
                                                                    name={field.name}
                                                                    value={formData[field.name]}
                                                                    onChange={(e) => handleChange(e)}
                                                                    required={field.required ? field.required : false}
                                                                />)
                                                            }
                                                            {field.error &&
                                                                <ErrorBox className="invalid-feedback" error={  intl.formatMessage({ id: field.error })} />
                                                            }
                                                        </fieldset>
                                                    )
                                                })}
                                            </Row>
                                        </div>)
                            })}
                        </div>
                        <Button color={submitColor} disabled={isSubmitDisabled} type="submit" block>
                            {submitText}
                        </Button>
                    </Form>
                </CardBody>
            </Card>)
    )
}

CustomForm.propTypes = {
    submitCallBack: PropTypes.func.isRequired,
    fields: PropTypes.object.isRequired
};

export default CustomForm
