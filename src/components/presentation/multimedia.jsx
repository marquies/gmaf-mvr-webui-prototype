import React, { useState} from 'react';
import MultimediaPlaybackPluginLoader from '../plugins/playback/multimedia/loader';
import NoPlugin from '../plugins/error/noplugin';
import BlobInfo from '../../js/BlobInfo';

function Multimedia(props){

//Load the React Components
const multimediaPlaybackComponents= MultimediaPlaybackPluginLoader;
const {mmco} = props;
var mmcofile= false;
var type=false;

function canRender(){

    //Take first File
    if(typeof(mmco) =="object" && mmco.mmcofiles && mmco.mmcofiles[0] && mmco.mmcofiles[0].filetype && mmco.mmcofiles[0].file){
        mmcofile= mmco.mmcofiles[0];
        Object.keys(multimediaPlaybackComponents).forEach((key) => {
            if(mmcofile.filetype.includes(key)){
                type=key
            };
          });
     
    }else
    {
        return false;
    }
    if(type==false){
        console.log("Type not recognized: ", type);
        return false;
    }

    return true;
}

return (
    <div className= {props.view === "details" ? 'playback-multimedia-container-big border-1 border rounded-3': 'playback-multimedia-container-small border-1 border rounded-3'}>
            { canRender() && typeof(multimediaPlaybackComponents[type]) === 'function'  ? React.createElement(multimediaPlaybackComponents[type], { data: mmcofile, start:props.start, setTimeCode: props.setTimeCode}):
            <NoPlugin/> }
       
    </div>
);

}

export default Multimedia;