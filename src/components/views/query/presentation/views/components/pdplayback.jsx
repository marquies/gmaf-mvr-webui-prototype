import React, { useState, useEffect} from 'react';
import PdPlaybackPluginLoader from '../../../../../plugins/playback/pd/loader';
import NoPlugin from '../../../../../plugins/error/noplugin';
import PlugInError from '../../../../../plugins/error/pluginerror';

function PdPlayback(props){

    //Load the React Components
    var pluginComponents= PdPlaybackPluginLoader;
    
    const [pluginSelectedIndex, setPluginSelectedIndex] = useState(0);
    
    // Map the Plugins to the indexes 
    useEffect(() => {
        
        console.log("TimeCode: ", props.timeCode);
        console.log(props.data[pluginSelectedIndex]);
    
    }, []); 

    function nextPlugin() {

        setPluginSelectedIndex((pluginSelectedIndex + 1) % Object.keys(pluginComponents).length);
        //console.log(pluginComponents[pluginSelectedIndex].canRender());
    }
    
    function canRender() {

        if(props.data != undefined &&  props.data[pluginSelectedIndex] != undefined && props.data[pluginSelectedIndex].id!=undefined && typeof(pluginComponents[props.data[pluginSelectedIndex].id]) === 'function') {
            return true;
        }
        return false; 
    }
    function noPlugin(){

        if(props.data != undefined && typeof(props.data) == 'object' && Object.keys(props.data).length >0 &&  Object.keys(pluginComponents).length!=0){

            return false;
        }
        return true;
    }

    return (
        <div className='query-wsd-container d-flex border-1 border rounded-3'>
            <div className='query-wsd-inner-container'>
                { noPlugin() ? <NoPlugin/>: 
                  canRender() ? React.createElement(pluginComponents[props.data[pluginSelectedIndex].id], {data: props.data[pluginSelectedIndex], timecode: props.timecode}):
                    <PlugInError/>  
                }
            </div>
              { noPlugin() ? "":<i class="fa fa-chevron-right fsize m-1" onClick={nextPlugin}></i>}
        </div>
    );
    
}

export default PdPlayback;