import React, { Component } from 'react';

class JumpToButton extends Component {

    state = { 
    }
   
    elementRef = React.createRef();

    changeSecond = (videoid, playbacksecond, currentid) => {

        //Stop all playback 
        var videos= document.getElementsByTagName("video");
        for (let i = 0; i < videos.length; i++) {

            var video= videos.item(i);   
            var isPlaying = video.currentTime > 0 && !video.paused && !video.ended && video.readyState > video.HAVE_CURRENT_DATA;

            if(isPlaying)
            {
                video.pause();
            }
        }
    
        if(document.activeElement === document.getElementById(currentid))
        {
            var playbackvideo= document.getElementById(videoid);
    
            if (playbackvideo !=null)
            {
                playbackvideo.currentTime= playbacksecond;
                playbackvideo.play();       
            }
        }
    };
     
    render() { 
        return  <button tabIndex="1" videoid={this.props.id} 
        className= "btn btn-sm btn-secondary focus-ring jumpto rounded-2"
        value={this.props.height} style= {{"height": this.props.height+ "px"}} 
        onClick={()=>this.changeSecond(this.props.id, this.props.playbacksecond, this.props.id+"-"+this.props.index)}
        onFocus={()=>this.changeSecond(this.props.id, this.props.playbacksecond, this.props.id+"-"+this.props.index)}
        id={this.props.id+"-"+this.props.index}
        key={this.props.id+"-"+this.props.index}
        >
        </button>
    }
}
 
export default JumpToButton;