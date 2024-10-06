import React, {useState} from 'react';

function ThreeDGolf() {
    
    const [text, setText] = useState(""); 

    function canRender(){
        return true;
    }

    return (

        <div>
            {canRender() ?
                <div>
                <div id="plugin" className=''>3D Golf, Course 18
                </div>
                <img src="pluginmedia/Course Golf.PNG" alt="Girl in a jacket" width="300" height="150"></img>
                </div>: ""

            }
        </div>
       
);

}

export default ThreeDGolf;