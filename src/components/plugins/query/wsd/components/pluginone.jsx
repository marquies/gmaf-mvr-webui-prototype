import React, { useState} from 'react';
import PluginError from '../../../pluginerror';


function PluginOne() {
    
    const [text, setText] = useState(""); 

    function canRender(){
        return false;
    }

    return (
        <div>
            {canRender() ? <div id="plugin" className=''>Plugin 1 Here!</div> : <PluginError/>}
        </div>
       
    );

}

export default PluginOne;