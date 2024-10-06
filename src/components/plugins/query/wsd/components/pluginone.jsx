import React, { useState} from 'react';


function PluginOne() {
    
    const [text, setText] = useState(""); 

    function canRender(){
        return false;
    }

    return (
        <div id="plugin" className=''>Plugin 1 Here!
        </div>
       
    );

}

export default PluginOne;