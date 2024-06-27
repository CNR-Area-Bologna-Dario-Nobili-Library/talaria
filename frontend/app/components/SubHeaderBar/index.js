import React, { useEffect,useRef } from 'react'
import './style.scss'
import { FormattedMessage } from 'react-intl';
import {useIntl} from 'react-intl'
import messages from 'routes/messages';
import {Row, Col} from 'reactstrap';
import {NavLink} from 'react-router-dom';
import ResourceHeaderBar from '../ResourceHeaderBar';

const SubHeaderBar = (props) => {
    const routes = props.routes.filter((route)=>route.header);
    const intl = useIntl()

    useEffect(() => {
        // set total width of the component for scrollY on Mobile
        /* const linkElements = document.querySelectorAll('.subheader-menu li')
        const subheaderMenu = document.querySelector('.subheader-menu');
        let totalWidth = 0

        if(linkElements.length > 0 && subheaderMenu){
            linkElements.forEach(el => {
                console.log(el)
                totalWidth += ( el.clientWidth + 30)
            })
            subheaderMenu.style.width = `${totalWidth}px`
        } */
    },[])

    let headerBkg=(props.auth.permissions && props.auth.permissions.roles && (props.auth.permissions.roles.includes("super-admin")||props.auth.permissions.roles.includes("manager") ))?'bg-red':'bg-dark-bk';  //red background for admin/manager

    //NOTE: in case of admin/manager we don't have "resource" (in `LibraryPage`) so i created a "fake resource" props to use here and in order to display always SubHeaderBar
    //otherwise it will be shown ONLY from librarian/institution's dashboard and not frm comm manager/admin
    return (
        <div className={`app-subheader ${headerBkg}`}>            
            {props.resource && props.auth && props.auth.permissions && props.auth.permissions.resources && <ResourceHeaderBar resource={props.resource} auth={props.auth} match={props.match}/>}
            <div className="container">                
                <Row className="subheader-menu pl-0">
                    { props.auth.permissions.resources && routes.map((route,i)=> (
                        <Col xs='auto' key={`${route.url}-${i}`} className={`${route.current ? 'current-page' : ''}`}>
                            <NavLink to={route.url} key={route.url}><FormattedMessage {...messages[route.name]}/></NavLink>
                        </Col>)
                    )}
                </Row>
            </div>
        </div>
    )
}


export default SubHeaderBar
