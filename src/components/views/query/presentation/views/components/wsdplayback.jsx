import React, { useState} from 'react';
import WsdPlaybackPluginLoader from '../../../../../plugins/playback/wsd/loader';
import NoPlugin from '../../../../../plugins/error/noplugin';

function WsdPlayback(props){

//Load the React Components
const pluginComponents= WsdPlaybackPluginLoader;

const [pluginSelectedIndex, setPluginSelectedIndex] = useState(0);

function nextPlugin() {

    setPluginSelectedIndex((pluginSelectedIndex + 1) % Object.keys(pluginComponents).length);
   
}

return (
    <div className='playback-wsd-container d-flex border-1 border rounded-3'>
        <div className='playback-wsd-inner-container'>
            { typeof(pluginComponents[pluginSelectedIndex]) === 'function'  ? React.createElement(pluginComponents[pluginSelectedIndex]):
            <NoPlugin/> }
        </div>
        { typeof(pluginComponents[pluginSelectedIndex]) === 'function'  ?   <i className="fa fa-chevron-right fsize m-1" onClick={nextPlugin}></i>:""}
    </div>
);

}

export default WsdPlayback;