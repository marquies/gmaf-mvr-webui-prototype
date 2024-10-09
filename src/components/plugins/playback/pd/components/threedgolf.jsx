import React, { Component, useState} from 'react';
import PlugInError from '../../../error/pluginerror';


function ThreeDGolf(props) {
    
    const [text, setText] = useState(""); 

    function canRender(){

        console.log(props.timeCode)
        if(props.data == undefined || props.timecode == undefined) {
            console.error("Video Data incomplete or TimeCode Setter not set :", props.data);
            return false;
        }

        return true;
    }

    return (
        <div id="plugin" className=''>
            {canRender() ? <div>Timecode: {props.timecode}</div> : <PlugInError/>}
        </div>
       
);

}

export default ThreeDGolf;