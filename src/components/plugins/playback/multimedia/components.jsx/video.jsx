import React, {useEffect, useRef} from 'react';


function Video(props) {
    
    const videoRef = useRef(null);

    function canRender(){

        if(props.data == undefined || props.data.url == undefined || props.setTimeCode == undefined) {
            console.error("Video Data incomplete or TimeCode Setter not set :", props.data);
            return false;
        }

        return true;
    }

    const handleTimeUpdate = () => {
        const video = videoRef.current;
        props.setTimeCode(video.currentTime);

    };

    // UseEffect to set up the event listener
    useEffect(() => {
        
        const video = videoRef.current;

        video.addEventListener('timeupdate', handleTimeUpdate);

        return () => {
            video.removeEventListener('timeupdate', handleTimeUpdate);
        };

    }, []);  

    return (

        <div id="" className='center-container'>
        
        { canRender()? <video className='centerelement' ref={videoRef} src= {props.data.url}  controls>
                </video>:
                "Imcomplete Video Data"}
      
        </div>        
    );

}

export default Video;