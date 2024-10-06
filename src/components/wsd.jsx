import React, { useState} from 'react';
import WsdQueryPluginLoader from './plugins/query/wsd/loader';

function Wsd(props){

function typeChanged(type) {

}

//Load the React Components
const pluginComponents= WsdQueryPluginLoader;

const [pluginSelectedIndex, setPluginSelectedIndex] = useState(0);

function nextPlugin() {

    setPluginSelectedIndex((pluginSelectedIndex + 1) % Object.keys(pluginComponents).length);
    //console.log(pluginComponents[pluginSelectedIndex].canRender());
}

return (
    <div>
        <i class="fa fa-chevron-right" onClick={nextPlugin}></i>
        { typeof(pluginComponents[pluginSelectedIndex]) === 'function'  ? React.createElement(pluginComponents[pluginSelectedIndex]):
        <p>This Plugin Could Not Be Loaded</p> }
    </div>
);

}

export default Wsd;