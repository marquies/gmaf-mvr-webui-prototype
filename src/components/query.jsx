import React, { Component } from 'react';
import Sketch from './sketch';


class Query extends Component {

    constructor() {
        super()
        this.state = {
         queryresult:{}
        }
        this.clearAll = this.clearAll.bind(this);
      }

      componentDidMount(){

        document.getElementById('accept-sketch').addEventListener('click', function(event) {

            document.getElementById("query-placeholder-image").style= "display:none";
            var canvasImageUrl= document.getElementById("canvas").toDataURL();
            var queryImage= document.getElementById("query-chosen-image");
            queryImage.src= canvasImageUrl;
            queryImage.style="display:block";
            document.getElementById("query-chosen-video").style= "display:none";
        
        });
    }

    fileInput(){

        document.getElementById('file-input').click();

    }
    fileUploaded(event){

        var tgt = event.target;
        var files = tgt.files;
        var videoTypes = ['.mp4', '.mov'];

        if (FileReader && files && files.length) {
        
            var filename= files[0].name;
            var fr = new FileReader();
            fr.readAsDataURL(files[0]);
            fr.onload = function () {
             
                var extension = filename.match(/\.[0-9a-z]+$/i)[0];
             
                //Video
                if(videoTypes.indexOf(extension)>=0)
                {
    
                    var queryVideo= document.getElementById("query-chosen-video");
                    queryVideo.src= fr.result;
                    queryVideo.style="display:block";
                    document.getElementById("query-placeholder-image").style= "display:none";
                    document.getElementById("query-chosen-image").style= "display:none";
                    return;
                }
            
                //Image
                var queryImage= document.getElementById("query-chosen-image");
                queryImage.src= fr.result;
                document.getElementById("query-placeholder-image").style= "display:none";
                document.getElementById("query-chosen-video").style= "display:none";
                queryImage.style="display:block";
            }
           
        }  
        // Not supported
        else {
            console.error("Image/Video Upload not supported");
        }
    }

    audioInput()
    {
        document.getElementById('audio-input').click();
    }

    audioUploaded(event)
    {
        var tgt = event.target;
        var files = tgt.files;

        if (FileReader && files && files.length) {
        
            var fr = new FileReader();
            fr.onload = function () {

                var audioplayback = document.getElementById("audio-playback");
                audioplayback.src= fr.result;
                audioplayback.style="display:block";
            }
            fr.readAsDataURL(files[0]);
        }  
        // Not supported
        else {
            console.log("Audio Upload not supported");
        }
    }

    clearAudio()
    {
        document.getElementById("audio-playback").src="";
    }
    clearText()
    {
        document.getElementById("query-textarea").value="";
    }
    clearImage()
    {
        document.getElementById("query-chosen-video").style= "display:none";
        document.getElementById("query-chosen-video").src= "";
        document.getElementById("query-chosen-image").style= "display:none";
        document.getElementById("query-chosen-image").src= "";
        document.getElementById("query-placeholder-image").style= "display:block";
    }
    clearAll()
    {
       this.clearAudio();
       this.clearText();
       this.clearImage();
    }


    render() { 
        return  <div id="query" className='mt-5'>
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
                            <textarea className="form-control textarea" id="query-textarea" rows="3" onChange={this.handleTextChange}></textarea>
                            <div className='query-menu mt-1'>
                                <button type="button" className='btn border border-secondary rounded-1 m-1' data-bs-toggle="modal" data-bs-target="#sketchinputModal"><span className="fa fa-paint-brush"></span></button>
                                <button onClick={this.fileInput} type="button" className='btn border border-secondary rounded-1 m-1'><span className="fa fa-image"></span></button>
                                <input type="file" onChange={this.fileUploaded} id="file-input" accept=".png,.jpg,.mp4,.mov"></input>
                                <button onClick={this.audioInput} type="button" className='btn border border-secondary rounded-1 m-1'><span className="fa fa-file-audio-o"></span></button>
                                <input type="file" onChange={this.audioUploaded} id="audio-input" accept=".mp3,.wav"></input>
                                <div className="dropdown m-1">
                                    <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Clear
                                    </button>
                                    <ul className="dropdown-menu">
                                        <li><button onClick={this.clearImage} className="dropdown-item" >Image/Video</button></li>
                                        <li><button onClick={this.clearText} className="dropdown-item" >Text</button></li>
                                        <li><button onClick={this.clearAudio} className="dropdown-item" >Audio</button></li>     
                                        <li><button onClick={this.clearAll} className="dropdown-item" >All</button></li>
                                    </ul>
                                </div>
                              
                            </div>
                            <h5 className="card-title mt-1">Presentation Options</h5>
                            <div className='query-menu mt-1'>
                                <div className="dropdown m-1">
                                    <button id="filter-button" className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        All types
                                    </button>
                                    <ul className="dropdown-menu">
                                        <li><button onClick={()=>this.props.filterChanged("Image")} className="dropdown-item" >Image</button></li>
                                        <li><button onClick={()=>this.props.filterChanged("Video")} className="dropdown-item" >Video</button></li>
                                        <li><button onClick={()=>this.props.filterChanged("Doc")} className="dropdown-item" >Doc</button></li>     
                                        <li><button onClick={()=>this.props.filterChanged(null)} className="dropdown-item" >All types</button></li>
                                    </ul>
                                </div>
                                <div className="dropdown m-1">
                                    <button id="mode-button" className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Static Cardview
                                    </button>
                                    <ul className="dropdown-menu">
                                        <li><button onClick={()=>this.props.modeChanged("static card")} className="dropdown-item" >Static Card</button></li>
                                        <li><button onClick={()=>this.props.modeChanged("dynamic swipe")} className="dropdown-item" >Dynamic Swipe</button></li>
                                    </ul>
                                </div>
                            </div>
                            <button id="submit-query"  onClick={()=>this.props.queryChanged(null)} style={{"float": "right"}} className="btn btn-primary mt-2">Query</button>   
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
    }
}
 
export default Query;