import React, { useState} from 'react';
import WsdQueryPluginLoader from '../../../plugins/query/wsd/loader';
//import NoPlugin from '../../../plugins/error/noplugin';

function WsdQuery(){


//Load the React Components
const pluginComponents= WsdQueryPluginLoader;

const [pluginSelectedIndex, setPluginSelectedIndex] = useState(0);

function nextPlugin() {
 
    setPluginSelectedIndex((pluginSelectedIndex + 1) % Object.keys(pluginComponents).length);
   
}

return (<div>
     
    <div className='query-wsd-container d-flex border-1 border rounded-3'>
        <div className='query-wsd-inner-container'>
            Select a location on the map
            { typeof(pluginComponents[pluginSelectedIndex]) === 'function' ? React.createElement(pluginComponents[pluginSelectedIndex],{}):
            <></> }
        </div>
        { typeof(pluginComponents[pluginSelectedIndex+1]) === 'function' ?   <i className="fa fa-chevron-right fsize m-1" onClick={nextPlugin}></i>:""}
    </div>
    </div>
);

}

export default WsdQuery;