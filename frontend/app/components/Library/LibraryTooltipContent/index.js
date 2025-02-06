import React from 'react'
import {useIntl} from 'react-intl';
import './style.scss';


const LibraryTooltipContent = (props) => {
    console.log('LibraryTooltipContent', props)
    const { data} = props
    const intl = useIntl();
    
    return (
            <div className='LibraryTooltipContent text-start text-nowrap'>                                       
                        <div class="tooltip-header">
                            <h4 className='tooltip-title'>{data.name} {/* data.alt_name && data.alt_name!="" && <span className='alternative_name'><i className='fa-solid fa-tag'></i> {data.alt_name}</span> */}</h4>                        
                            
                            {data.institution && <h5 className='tooltip-subtitle text-muted'>{data.institution.data.name}</h5>}
                        </div>
                        <div className="tooltip-body">              
                            
                            <div className='text-start text-nowrap'>
                                {data.country && <span className='country'>{data.country.data.name}&nbsp;</span>}
                                {data.town && <span>{data.town}</span>}
                                {data.ill_email && <div><i class="fa-solid fa-envelope"></i>&nbsp;{data.ill_email}</div>}
                                {data.ill_phone && <div><i class="fa-solid fa-phone"></i>&nbsp;{data.ill_phone}</div>}
                            </div>

                        </div>                      
            </div>                     
    )
}

export default LibraryTooltipContent;
