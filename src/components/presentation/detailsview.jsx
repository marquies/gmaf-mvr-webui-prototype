import React, { useEffect, useState} from 'react';
import Playback from './playback';

function DetailsView(props){

const [selectedIndex, setSelectedIndex] = useState(0);

function canRender(index){

    if(props.showresults !== undefined && props.showresults[index] !== undefined && props.showresults[index].md !== undefined && props.showresults[index].md.id !== undefined){

        return true;
    }  
    //console.error("Presentation Data incomplete for props.Showresults index :", index);
    return false;
}

useEffect(() => {   
    console.log("Index changed: "+selectedIndex);
}, [selectedIndex]);

return (
    <div className='details-container ms-5 d-flex'>
        <div className='chevron-container'>
        {canRender(selectedIndex-1)?<i class="fa fa-chevron-left fa-3x  m-1" onClick={() => setSelectedIndex(selectedIndex -1)}></i>:""}
        </div>
        {canRender(selectedIndex) ? <Playback cmmco={props.showresults[selectedIndex]} id={props.showresults[selectedIndex].md.id} view={"details"} /> : <></>}
        <div>
        {canRender(selectedIndex+1)?<i class="fa fa-chevron-right fa-3x  m-1" onClick={() => setSelectedIndex(selectedIndex + 1)}></i>:""}
        </div>
    </div>

);

}

export default DetailsView;