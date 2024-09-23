import React, { Component, useState} from 'react';
import Sketch from './sketch';



function QueryNew() {
    
    const [textSelected, setTextSelected] = useState(""); // Kein Typ notwendig

    function handleTextChange(event) {
       
        setTextSelected(event.target.value);

        console.log("textSelected", textSelected);

    }
    
    return (
        <div id="query" className='mt-5'>
            <div className="card" style={{width: "30rem"}}>
                <div className="card-body">
                    <div className="visual-input mb-2 border-1 border rounded-3">
                        <i id= "query-placeholder-image" className="query-placeholder-image fa fa-image fa-3x"></i>
                        <img id="query-chosen-image" src="" style={{display:"none"}} alt=""/>
                        <video id="query-chosen-video" src="" style={{display:"none"}} controls/>
                    </div>
                    <div>
                        <audio id="audio-playback" className='m-2' controls src="">
                            <source src="" type="audio/ogg"/>
                        </audio>    
                    </div>
                    <h5 className="card-title">Formulate Query</h5>
                    <p className="card-text">Input Text, Video, Images, Audio or draw your sketch.</p>
                    <textarea className="form-control textarea" id="query-textarea" rows="3" onChange={handleTextChange}></textarea>
                </div>
            </div>
        </div>
);

}

export default QueryNew;