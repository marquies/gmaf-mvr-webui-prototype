import React, { Component, useState} from 'react';


function Image(props) {

    const{data}= props;

    function canRender(){
  
        if(data == undefined || data.file == undefined){
            console.error("Image Data incomplete :", data);
            return false;
        }
        return true;
    }

    return (
        <div id="" className='center-container'>
            <div className='center-inner-container'>
            {canRender()?<img src={data.file} className="centerelement" alt="" ></img>:"Imcomplete Image Data"}
            </div>
        </div>       
    );

}

export default Image;