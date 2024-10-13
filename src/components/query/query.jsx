import React, { Component, useState} from 'react';
import Sketch from '../old/sketch';
import Filter from './filter';
import Wsd from './wsdquery';
import WsdQuery from './wsdquery';



function Query(props) {
    
    const [text, setText] = useState(""); 
    const [image, setImage] = useState(false);  
    const [audio, setAudio] = useState(false);
    const [wsd, setWsd] = useState(false);
    const [wsdUnfolded, setWsdUnfolded] = useState(false);
    const [filterUnfolded, setFilterUnfolded] = useState(false);
   

    const [pluginSelected, setPluginSelected] = useState(0);

    function textChange(event) {
        setText(event.target.value);
    }    

    function imageInput() {
        //for styled buttons trigger hiddenfield here
        document.getElementById('image-input').click();
    }
    function audioInput() {
        //for styled buttons trigger hiddenfield here
        document.getElementById('audio-input').click();
    }

    function imageUploaded(event) {

        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImage(imageUrl);
        }
    }

    function audioUploaded(event) {
        
        const file = event.target.files[0];
        if (file) {
            const audioUrl = URL.createObjectURL(file);
            setAudio(audioUrl);
        }
    }

    function clearImage() {
        setImage(false);
    }

    function clearText() {
        setText("");
    }

    function clearAudio() {
       setAudio(false);
    }

    function clearAll() {
        setText("");
        setImage(false);
        setAudio(false);
    }
    
    function createMmcoQuery() {

        const mmco={
            image: image,
            audio: audio
        }
        const cmmcoQuery = {
            SRD:{},
            PD:{},
            MMCO:mmco,
            MD:{description: text},
            WSD:{}
        }
        return cmmcoQuery;
    }
    
    return (
     
        <div className='query'>
                <div className="card" style={{width: "100%"}}>
                    <div className="card-body">
                        <div className='border-1 border rounded-3'>
                            <div className="visual-input mb-2 border-1 border rounded-3">
                            {image ? 
                                <img id="query-chosen-image" src={image} alt=""/>
                                : <i id= "query-placeholder-image" className="query-placeholder-image fa fa-image fa-3x"></i>
                            }
                            </div>
                            <div>
                                <audio id="audio-playback" className='m-2' controls src="">
                                    <source src={audio} type="audio/ogg"/>
                                </audio>    
                            </div>
                            <div>
                                <div className='query-menu mt-1'>
                            { /*<button type="button" className='btn border border-secondary rounded-1 m-1' data-bs-toggle="modal" data-bs-target="#sketchinputModal"><span className="fa fa-paint-brush"></span></button>*/}
                                <button onClick={imageInput} type="button" className='btn border border-secondary rounded-1 m-1'><span className="fa fa-image"></span></button>
                                <button onClick={audioInput} type="button" className='btn border border-secondary rounded-1 m-1'><span className="fa fa-file-audio-o"></span></button>
                                <input type="file" onChange={imageUploaded} hidden id="image-input" accept=".png,.jpg"></input>  
                                <input type="file" onChange={audioUploaded} hidden id="audio-input" accept=".mp3,.wav"></input>  
                                <div className="dropdown m-1">
                                    <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Clear
                                    </button>
                                    <ul className="dropdown-menu">
                                        <li><button onClick={clearImage} className="dropdown-item" >Image/Video</button></li>
                                        <li><button onClick={clearText} className="dropdown-item" >Text</button></li>
                                        <li><button onClick={clearAudio} className="dropdown-item" >Audio</button></li>     
                                        <li><button onClick={clearAll} className="dropdown-item" >All</button></li>
                                    </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <textarea className="form-control textarea mt-1" placeholder="Enter your text query..." id="query-textarea" value={text} rows="3" onChange={textChange}></textarea>
                            <div><i class="fa fa-chevron-down"onClick={() => setWsdUnfolded(!wsdUnfolded)}></i></div>   
                            {wsdUnfolded ? <WsdQuery ></WsdQuery>: ""}
                            <div><i class="fa fa-chevron-down"onClick={() => setFilterUnfolded(!filterUnfolded)}></i></div>
                            {filterUnfolded ? <Filter setFilter={props.setFilter}></Filter> :""}     
                     <button className="w-25 btn btn-primary mt-2 float-end"  onClick={ ()=> props.query(createMmcoQuery())}>Query</button>   
                    </div>
            </div>     
        </div>

       
    );

}

export default Query;