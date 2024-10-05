import React, { Component, useState} from 'react';
import Sketch from './old/sketch';
import Filter from './filter';
import Plugin1 from './Plugins/plugin1';
import Config from './Plugins/config';
import config from './Plugins/config';
import PluginConfig from './Plugins/config';
import Wsd from './wsd';



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
        /*
        const file = event.target.files[0];
        if (file) {
            const audioUrl = URL.createObjectURL(file);
            setAudio(audioUrl);
        }
            */
    }

    function submit() {
        console.log("Submit")
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
    
    function getPluginComponent(plugInName){

        //props.plugins[pluginSelected]
        //Check if listed in Config
        return PluginConfig[plugInName];
    }

    function changePlugIn(plugin) {
        setPluginSelected(plugin);
    }

    
    return (
     

        <div>
            <div>
                Query Modul
                <div className="card" style={{width: "30rem"}}>
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
                        <textarea className="form-control textarea" id="query-textarea" value={text} rows="3" onChange={textChange}></textarea>
                        <div><i class="fa fa-chevron-down"onClick={() => setWsdUnfolded(!wsdUnfolded)}></i></div>
                        {wsdUnfolded ? <Wsd></Wsd>: ""}
                        <div><i class="fa fa-chevron-down"onClick={() => setFilterUnfolded(!filterUnfolded)}></i></div>
                        {filterUnfolded ? <Filter setFilter={props.setFilter}></Filter> :""}     
                    </div>
                </div>
            </div>     


        {/*
        <div id="query" className='mt-5'>
               <button onClick={changePlugIn}> Chang Plugin</button>
            {typeof getPluginComponent(props.plugins[pluginSelected]) === 'function'? React.createElement(getPluginComponent(props.plugins[pluginSelected])):"PlugIn Not found"}    
            <div className="card" style={{width: "30rem"}}>
                <div className="card-body">
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
                    <h5 className="card-title">Formulate Query</h5>
                    <p className="card-text">Input Text, Video, Images, Audio or draw your sketch.</p>
                    <textarea className="form-control textarea" id="query-textarea" value={text} rows="3" onChange={textChange}></textarea>
                    <div className='query-menu mt-1'>
                        <button type="button" className='btn border border-secondary rounded-1 m-1' data-bs-toggle="modal" data-bs-target="#sketchinputModal"><span className="fa fa-paint-brush"></span></button>
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
                      <Filter></Filter>
                        <button id="submit-query"  onClick={submit} style={{"float": "right"}} className="btn btn-primary mt-2">Query</button>   
                        </div>
                        <div className="modal fade" id="sketchinputModal" tabIndex="-1" aria-labelledby="sketchinputModalLabel" aria-hidden="true">
                            <div className="modal-dialog modal-lg">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h1 className="modal-title fs-5" id="sketchinputModalLabel">Create your Sketch for Query</h1>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        <Sketch></Sketch>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                        <button id="accept-sketch" type="button"  data-bs-dismiss="modal" className="btn btn-primary">Save changes</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                 </div>
            </div>
            */}
        </div>

       
    );

}

export default Query;