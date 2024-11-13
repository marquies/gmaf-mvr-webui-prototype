import React, { useState, useEffect} from 'react';
import PdPlaybackPluginLoader from '../../../../../plugins/playback/pd/loader';
import NoPlugin from '../../../../../plugins/error/noplugin';
import PlugInError from '../../../../../plugins/error/pluginerror';

function PdPlayback(props){

    //Load the React Components
    var PdPlaybackComponents= PdPlaybackPluginLoader;
    const {pd} = props;
    const [pluginSelectedIndex, setPluginSelectedIndex] = useState(0);
    var pdfile= false;
    var type=false;

    
      // Map the Plugins to the indexes 
      useEffect(() => {
        
    }, [pluginSelectedIndex]); 

    
    function nextPlugin() {

        setPluginSelectedIndex((pluginSelectedIndex + 1) % Object.keys(PdPlaybackComponents).length);
        //console.log(pluginComponents[pluginSelectedIndex].canRender());
    }
    
    function canRender() {

     //Take selected file
     if(typeof(pd) =="object" && pd.mmcofiles && pd.mmcofiles[pluginSelectedIndex] && pd.mmcofiles[pluginSelectedIndex].filetype && pd.mmcofiles[pluginSelectedIndex].file){

        pdfile= pd.mmcofiles[pluginSelectedIndex];
        Object.keys(PdPlaybackComponents).forEach((key) => {
            if(pdfile.filetype.includes(key)){
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
    function noPlugin(){
          
        if(pd.mmcofiles!= undefined && typeof(pd.mmcofiles) == 'object' && Object.keys(pd.mmcofiles).length >0 &&  Object.keys(PdPlaybackComponents).length!=0){
         
            return false;
        }
       
        return true;
    }

    return (
        <div className='query-wsd-container d-flex border-1 border rounded-3'>
            <div className='query-wsd-inner-container'>
                { noPlugin() ? <NoPlugin/>: 
                  canRender() && typeof(PdPlaybackComponents[type]) === 'function'  ?
                   React.createElement(PdPlaybackComponents[type], { data: pdfile, timecode: props.timecode, start:props.start}):
                    <PlugInError/>  
                }
            </div>
              { noPlugin() ? "":<i className="fa fa-chevron-right fsize m-1" onClick={nextPlugin}></i>}
        </div>
    );   
}

export default PdPlayback;