import React, { Component } from 'react';
import JumpToButton from './jumptobutton';
import Model from '../js/Model';
import GMAFAdapter from '../js/GMAFAdapter';

class VideoCard extends Component {
    state = {  } 

    constructor() {
        super()
      
        this.process= this.process.bind(this);
        this.delete= this.delete.bind(this);
        this.showDetails= this.showDetails.bind(this);
    }

    componentDidMount()
    {
        //if in order, this is the highest match. Start Playback there
        if(this.props.playbacks[0])
        {
            var startPlayBack= this.props.playbacks[0];
            var playbackvideo= document.getElementsByClassName("presentation-video")[startPlayBack.id];
    
            if (playbackvideo !=null)
            {
                playbackvideo.currentTime= startPlayBack.playbacksecond;   
            }
        }
    }

    async process(){

        console.log("Process: ", this.props.id);
        var model= new Model();
        var result = await model.processItem(this.props.id);
        console.log("result", result);
        
    }

    async delete(){   
        var gmaf = new GMAFAdapter("stw476");
        var deleted = await gmaf.deleteItemFromCollection(this.props.id);
        if(deleted){
            this.props.setCollectionState(this.props.id, "delete", "collection");
            return;
        }

        alert("Something went wrong, when trying to delete the item!");
    }

    showDetails(){
        console.log("Details: ", this.props.id);
    }

    render() { 
            return <div className="card presentation-card center"   key={this.props.id}> 
                        <div className="card-header">
                            <div className="dropdown">
                                    <div /*onClick={this.fileInput}*/ type="button" data-bs-toggle="dropdown" aria-expanded="false" className='btn single-view'>
                                        <span className="fa-solid  fa fa-ellipsis-v"></span>
                                    </div>
                                    <ul className="dropdown-menu">
                                        <li><button onClick={this.process} className="dropdown-item" >Process</button></li>
                                        <li><button onClick={this.showDetails} className="dropdown-item" >Show Details</button></li>
                                        <li><button onClick={this.delete} className="dropdown-item" >Delete</button></li>     
                                    </ul>
                                </div>
                            {this.props.type==="video"?
                                    <div>
                                        <video id={this.props.id} src={this.props.url} className="card-img-top presentation-video" controls></video>
                                        <div className="d-flex">
                                            {this.props.playbacks.map((playback, x) => (
                                                <JumpToButton key={x} index={x} height={playback.value} value={playback.value} playbacksecond={playback.playbacksecond} id={playback.id}/>
                                            ))}
                                        </div>
                                    </div>
                                :""
                            }
                             
                            
                            {this.props.type==="image"?(
                                    <img id={this.props.id} src={this.props.url} className="card-img-top presentation-img" alt="" controls></img>
                                ):""
                            }
                        </div>
                        <div className="card-footer">
                            <p>{ this.props.metadata.fileName.length>17?   this.props.metadata.fileName.substr(0, 17)+"...":this.props.metadata.fileName }</p>
                        </div>
                    </div>
    }
}
 
export default VideoCard;