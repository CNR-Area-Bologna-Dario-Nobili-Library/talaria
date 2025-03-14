import React, {useState} from 'react'
import {useIntl} from 'react-intl'
import PropTypes from 'prop-types'
import {Form, InputGroup, InputGroupAddon, Button, Input} from 'reactstrap';
import './style.scss'

const InputSearch = (props) => {
    
    const {submitCallBack, searchOnChange, className, placeholder, icon, clearButton=false} = props 
    const intl = useIntl()
    
    const [query, setQuery] = useState('')
    const handleChange = (e) =>  {
        const q = e.target.value
        setQuery(q)
        if(searchOnChange){
            submitCallBack(q);
            //setQuery('');
        } 
    }
    
    const handleSubmit = (e) => {
        e.preventDefault()
        submitCallBack(query)
        //setQuery('')
    }

    const clearinput=() => {        
        setQuery('')
        submitCallBack('');
    }
    
    return (
        <Form className={`form-search ${className ? className : ''}`} noValidate onSubmit={handleSubmit}>
            <InputGroup>
                <Input 
                    required 
                    placeholder={placeholder ? placeholder : intl.formatMessage({id: 'app.global.search'})}
                    //value={props.query ? props.query : query}
                    value={query}
                    onChange={handleChange} 
                    type="text" 
                    name="inputQuery" 
                    id="inputQuery" 
                    className={`${query.length > 0 ? 'has-value' : ''} searchInput`} 
                    />
                    {query.length > 0 && (
                        <InputGroupAddon addonType="append" className="clearButton">
                            {!searchOnChange &&
                                <Button type="button" onClick={() => submitCallBack(query)} className="searchBtn">
                                <i className="fa-regular fa-search"></i>
                        </Button>
                            }
                            <Button type="button" onClick={() => clearinput()} className="searchBtn">
                                <i className="fa-regular fa-circle-xmark"></i>
                            </Button>
                        </InputGroupAddon>
                    )}
            </InputGroup>
        </Form>
    )
}

InputSearch.propTypes = {
    submitCallBack: PropTypes.func.isRequired,
    className: PropTypes.string,
    placeholder: PropTypes.string,
    icon: PropTypes.string,
};

export default InputSearch