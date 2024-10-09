import React, { useState} from 'react';
import MultimediaPlaybackPluginLoader from '../plugins/playback/multimedia/loader';
import NoPlugin from '../plugins/noplugin';

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
    <div className='query-wsd-container d-flex border-1 border rounded-3'>
        <div className='query-wsd-inner-container'>
            { canRender() && typeof(multimediaPlaybackComponents[props.mmco.playbacktype]) === 'function'  ? React.createElement(multimediaPlaybackComponents[props.mmco.playbacktype], { data: props.mmco[props.mmco.playbacktype]}):
            <NoPlugin/> }
        </div>
    </div>
);

}

export default Multimedia;