import React, { useEffect, useState, useRef} from 'react';
import Multimedia from './multimedia';
import ToolTip from './tooltip';
import PdPlayback from './pdplayback';
import WsdPlayback from './wsdplayback';


function Playback(props){

const [wsdUnfolded, setWsdUnfolded] = useState(false);
const [pdUnfolded, setPdUnfolded] = useState(false);
const [timeCode, setTimeCode] = useState(props.cmmco.start);
const [isTooltipVisible, setIsTooltipVisible] = useState(false);
const {cmmco} = props;

useEffect(() => {
    //console.log("Timecode in Parent: ", timeCode);
}, [timeCode]);

  // Ref to store the timeout ID
  const hoverTimeout = useRef(null);

  const handleRightClick = (event) => {
  // event.preventDefault(); // Prevent the default context menu
   setIsTooltipVisible(true);
 };

  // For Hover by time! 
  const handleMouseEnter = () => {
    /*
    hoverTimeout.current = setTimeout(() => {
      setIsTooltipVisible(true);
    }, 2000); // 2000 ms = 2 seconds
    */
  };


    // Handle mouse leave (clear timer and hide tooltip)
    const handleMouseLeave = () => {
       clearTimeout(hoverTimeout.current);
       setIsTooltipVisible(false);
    };


return (
        <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onContextMenu={handleRightClick} className={props.view === "details" ? "playback-big" : "playback-small"}>
            <div className='tooltip-container'>
              {isTooltipVisible? <ToolTip md={props.cmmco.md} />:""}
              </div>
            <div className="card bg-light" style={{width: "100%"}}>
                <div className="card-body">
                    <div className='border-1 border rounded-3'>
                        <Multimedia view={props.view} mmco={cmmco.mmco} start={props.cmmco.start} setTimeCode={setTimeCode} />
                        {/*<Controls setTimeCode={setTimeCode} />*/}
                        <div><i class="fa fa-chevron-down fsize fa-2xs"onClick={() => setWsdUnfolded(!wsdUnfolded)}></i></div>   
                            {wsdUnfolded ? <WsdPlayback ></WsdPlayback>: ""}
                        <div><i class="fa fa-chevron-down fsize"onClick={() => setPdUnfolded(!pdUnfolded)}></i></div>
                            {pdUnfolded ? <PdPlayback data={props.cmmco.pd} timecode={timeCode}></PdPlayback> :""}  
                   </div>    
                </div>
            </div>    
        </div> 
    );

}

export default Playback;