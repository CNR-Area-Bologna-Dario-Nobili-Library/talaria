import React, { useEffect, useState } from 'react';

import { FormattedMessage } from 'react-intl';
import { Link, NavLink } from 'react-router-dom';
import { DropdownItem, DropdownMenu, DropdownToggle,Form, Dropdown, Nav, NavItem } from 'reactstrap';
import './style.scss';
import {useIntl} from 'react-intl';
import flagIT from '../../images/lang/it.svg';
import flagEN from '../../images/lang/en.svg';
import flagES from '../../images/lang/es.svg';
import flagTR from '../../images/lang/tr.svg';
import flagAR from '../../images/lang/ar.svg';

function LanguageSelectionDropDown(props) {

  console.log('LanguageSelectionDropDown', props)
 
  const {changeLang}=props

  const intl=useIntl();

  const currentLang=  intl.locale; //get default lang from browser or even from user's preference (if previously changed UI lang)

  const [languages] = useState([
    { code: 'it', title: 'Italiano', flag: flagIT},
    { code: 'en', title: 'English (UK)' , flag: flagEN},
    { code: 'es', title: 'Español' , flag: flagES},
    { code: 'tr', title: 'Türkçe', flag: flagTR},
    //{ code: 'ar', title: 'العربيّة', flag:flagAR}   
  ]);

  const getFlag=(code) => {
    return code
  }

  const [toggleContents, setToggleContents] = useState(getFlag(currentLang));
  const [dropdownOpen,setDropdownOpen]=useState(false);

  const changeLanguage = (code => {
    if(code!="")
    {
      console.log("changeLang:"+code)            
      changeLang(code);             
    }
  })

  const getFlagByCode=(code)=>{
    let flag=""
    switch (code)  {
      case 'it': flag=flagIT; break;
      case 'en': flag=flagEN; break;
      case 'es': flag=flagES; break;
      case 'tr': flag=flagTR; break;
      case 'ar': flag=flagAR; break;       
    }
    if(flag!="" && code!="")           
      return <img className="flagIcon" src={flag}/>
    else return <span>Select language</span>  

  }

  useEffect(() => {        
        setToggleContents(getFlagByCode(currentLang))
    },[currentLang]);


  const toggle = () => {
    setDropdownOpen(!dropdownOpen);
  }
  
  return (
    <Nav className="langdropdown" navbar>
      <NavItem>
        <Dropdown className="langDropdown" isOpen={dropdownOpen} toggle={()=>toggle()}>
          <DropdownToggle caret nav>{toggleContents}</DropdownToggle>
          <DropdownMenu right className='langDropdownMenu'>
            {languages.map(({ code, title, flag }) => (
              <DropdownItem className="btn btn-link" key={code} onClick={(ev)=>changeLanguage(code)}>{getFlagByCode(code)} {title}</DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
    </NavItem>     
  </Nav>
 )
  
}

export default LanguageSelectionDropDown;
