import React, { Component, useState} from 'react';
import Sketch from '../old/sketch';
import Filter from '../filter';



function Plugin1() {
    
    const [text, setText] = useState(""); 

    function canRender(){

    }

    return (
        <div id="plugin" className=''>Plugin 1 Here!
        </div>
       
);

}

export default Plugin1;