import React, { useState} from 'react';
import Playback from './playback';

function BrowseView(props){


function canRender(index){

    if(props.showresults !== undefined && props.showresults[index] !== undefined && props.showresults[index].md !== undefined && props.showresults[index].md.id !== undefined){

        return true;
    }
    
    console.error("Presentation Data incomplete for props.Showresults index :", index);
    return false;
}

return (
    
    <div className='d-flex flex-wrap flex-start gap'>
        {props.showresults.map((showresult, index) => (
            canRender(index)? <Playback cmmco={showresult} id={showresult.md.id} view={"browse"} />: ""
        ))}
    </div>

);

}

export default BrowseView;