import React, { useState} from 'react';
import Playback from './components/playback';

function BrowseView(props){

const {cmmcos} = props;

function canRender(){

    if(cmmcos === false || typeof(cmmcos) != 'object'){
        //console.log("false or not an object: ", cmmcos);
        return false;
    }

    return true;
}

return (
  <div>
     {canRender()?
    <div className='d-flex flex-wrap flex-start gap'>
       
        {cmmcos.map((cmmco, index) => (
            canRender(index)? <Playback key={index} cmmco={cmmco} id={cmmco.md.id} view={"browse"} deletable={props.deletable} deleteItem={props.deleteItem}/>: null
        ))}
     
    </div>
       :""
    }
    </div>
);

}

export default BrowseView;