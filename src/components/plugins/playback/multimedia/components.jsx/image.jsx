import React, { Component, useState} from 'react';


function Image(props) {


    function canRender(){
  
        if(props.data == undefined || props.data.url == undefined){
            console.error("Image Data incomplete :", props.data);
            return false;
        }
        return true;
    }

    return (
        <div id="" className='center-container'>
            <div className='center-inner-container'>
            {canRender()?<img src={props.data.url} className="centerelement" alt="" ></img>:"Imcomplete Image Data"}
            </div>
        </div>       
    );

}

export default Image;