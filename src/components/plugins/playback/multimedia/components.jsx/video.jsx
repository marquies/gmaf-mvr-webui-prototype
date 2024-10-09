import React, { Component, useState} from 'react';


function Video(props) {
    
    function canRender(){
        if(props.data == undefined || props.data.url == undefined){
            console.error("Video Data incomplete :", props.data);
            return false;
        }
        return true;
    }

    return (
        <div id="" className=''>
            {canRender()? <video width="320" height="240" controls>
                    <source src= {props.data.url} type="video/mp4"/>
                </video>:
                "Imcomplete Video Data"}
        </div>       
    );

}

export default Video;