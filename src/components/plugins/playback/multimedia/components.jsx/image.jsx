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
        <div id="" className=''>
            {canRender()?<img src={props.data.url} className="card-img-top presentation-img" alt="" ></img>:"Imcomplete Image Data"}
        </div>       
    );

}

export default Image;