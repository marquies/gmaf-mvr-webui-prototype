import React, { useState} from 'react';
import MultimediaPlaybackPluginLoader from '../plugins/playback/multimedia/loader';
import NoPlugin from '../plugins/error/noplugin';

function Multimedia(props){

//Load the React Components
const multimediaPlaybackComponents= MultimediaPlaybackPluginLoader;

function canRender(){
    
    if(props.mmco.playbacktype == undefined || props.mmco[props.mmco.playbacktype] == undefined){

        console.error("playbacktype MMCO Mismatch, Playbacktype: ", props.mmco.playbacktype);
        return false;
    }

    return true;
}

return (
    <div className= {props.view === "details" ? 'playback-multimedia-container-big border-1 border rounded-3': 'playback-multimedia-container-small border-1 border rounded-3'}>
            { canRender() && typeof(multimediaPlaybackComponents[props.mmco.playbacktype]) === 'function'  ? React.createElement(multimediaPlaybackComponents[props.mmco.playbacktype], { data: props.mmco[props.mmco.playbacktype], setTimeCode: props.setTimeCode}):
            <NoPlugin/> }
       
    </div>
);

}

export default Multimedia;