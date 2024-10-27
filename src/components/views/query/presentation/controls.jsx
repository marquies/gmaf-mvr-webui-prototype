import React, { useState} from 'react';
import MultimediaPlaybackPluginLoader from '../plugins/playback/multimedia/loader';
import NoPlugin from '../plugins/error/noplugin';

function Controls(props){

//Load the React Components
const multimediaPlaybackComponents= MultimediaPlaybackPluginLoader;

function canRender(){
    
}

return (
    <div className='playback-multimedia-container border-1 border rounded-3'>
    
       
    </div>
);

}

export default Controls;