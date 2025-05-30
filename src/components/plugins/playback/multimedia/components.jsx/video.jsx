import React, {useEffect, useRef} from 'react';


function Video(props) {
    
    const videoRef = useRef(null);
    const{data, setTimeCode, start, end}= props;

    function canRender(){
       

        if(data === undefined || data.file === undefined || setTimeCode === undefined) {
            console.error("Video Data incomplete or TimeCode Setter not set :", props.data);
            return false;
        }

        return true;
    }

    const handleTimeUpdate = () => {
        const video = videoRef.current;
        props.setTimeCode(video.currentTime);

    };

    function parseTimecode(timecode) {
       
        if (!timecode) {
            return false;
        }
        const parts = timecode.split(':').map(parseFloat); // Split by ":" and convert each part to a number
        if (parts.length === 3) {
          const [hours, minutes, seconds] = parts;
          return hours * 3600 + minutes * 60 + seconds; // Convert to total seconds
        }
        return 0; // Default to 0 if parsing fails
      }



    // UseEffect to set up the event listener
    useEffect(() => {

        //Set Video StartTime
        const video = videoRef.current;
        //console.log("PROPS Start:  ", props.start);
        var secondsStart= parseTimecode(props.start);
        var secondsEnd= parseTimecode(props.end);
        var middleSeconds= (secondsStart+secondsEnd)/2;
        
        video.currentTime = secondsStart+1;//middleSeconds;

        //console.log("Seconrds   ", seconds);
       

        video.addEventListener('timeupdate', handleTimeUpdate);

        return () => {
            video.removeEventListener('timeupdate', handleTimeUpdate);
        };

    }, [start, end]);  

    return (

        <div id="" className='center-container'>
        
        { canRender()? <video preload="metadata" className='centerelement' ref={videoRef} src= {data.file}  controls> Your browser does not support the video tag.
                </video>:
                "Imcomplete Video Data"}
      
        </div>        
    );

}

export default Video;