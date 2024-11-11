import React, { useState} from 'react';
import PluginError from '../../../error/pluginerror';
import NoPlugin from '../../../error/noplugin';


function PluginOne() {
    
    const [text, setText] = useState(""); 

    function canRender(){
        return false;
    }

    return (
        <div>
            {canRender() ? <div id="plugin" className=''>Plugin 1 Here!</div> : <NoPlugin/>}
        </div>
       
    );

}

export default PluginOne;