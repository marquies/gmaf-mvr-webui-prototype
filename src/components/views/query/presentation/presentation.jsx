import React, { } from 'react';
import BrowseView from './views/browseview';
import DetailsView from './views/detailsview';

function Presentation(props) {
    
    const {cmmcos} = props;

    function canRender(){
      
        return true;
    }
    
    return (
        <div className= {props.presentationView==="Browse View"? "presentation ms-2 overflow-auto": "presentation"}>
            { canRender()?  
                props.presentationView==="Browse View"? 
                    <BrowseView updateStatus={props.updateStatus} page={props.page} numberOfPages={props.numberOfPages} cmmcos={cmmcos} deletable={props.deletable} deleteItem={props.deleteItem} />
                    :<DetailsView cmmcos={cmmcos} />
            : "Could not Render"}
        </div>  
    );
          

}

export default Presentation;