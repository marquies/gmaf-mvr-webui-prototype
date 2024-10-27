import React, { useState} from 'react';
import WsdQueryPluginLoader from '../../../plugins/query/wsd/loader';
import NoPlugin from '../../../plugins/error/noplugin';

function WsdQuery(props){


//Load the React Components
const pluginComponents= WsdQueryPluginLoader;

const [pluginSelectedIndex, setPluginSelectedIndex] = useState(0);

function nextPlugin() {

    setPluginSelectedIndex((pluginSelectedIndex + 1) % Object.keys(pluginComponents).length);
   
}

return (
    <div className='query-wsd-container d-flex border-1 border rounded-3'>
        <div className='query-wsd-inner-container'>
            { typeof(pluginComponents[pluginSelectedIndex]) === 'function'  ? React.createElement(pluginComponents[pluginSelectedIndex]):
            <NoPlugin/> }
        </div>
        { typeof(pluginComponents[pluginSelectedIndex]) === 'function'  ?   <i class="fa fa-chevron-right m-1" onClick={nextPlugin}></i>:""}
    </div>
);

}

export default WsdQuery;