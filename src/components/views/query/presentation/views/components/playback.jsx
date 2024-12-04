import React, { useEffect, useState} from 'react';
import Multimedia from './multimedia';
import ToolTip from './tooltip';
import PdPlayback from './pdplayback';
import WsdPlayback from './wsdplayback';
import GMAFAdapter from '../../../../../../js/GMAFAdapter';


function Playback(props){

const [wsdUnfolded, setWsdUnfolded] = useState(false);
const [pdUnfolded, setPdUnfolded] = useState(false);
const [timeCode, setTimeCode] = useState(props.cmmco.start);
const [isTooltipVisible, setIsTooltipVisible] = useState(false);
const {cmmco} = props;


  // Ref to store the timeout ID
  //const hoverTimeout = useRef(null);

  const handleRightClick = (event) => {
   //event.preventDefault(); // Prevent the default context menu
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
       //clearTimeout(hoverTimeout.current);
       //setIsTooltipVisible(false);
  };

  async function deleteitem(){

    var gmaf= await GMAFAdapter.getInstance();
    console.log("ID To Delete: ",props.id);
    var result= await gmaf.deleteItemFromCollection(props.id);
  
    if(result === "true"){
      alert("Item deleted successfully!");
    }else
    {
      alert("Item deletion failed!");
    }
   
    if(props.deleteItem){

      props.deleteItem(props.id);
    }

}


return (
        <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onContextMenu={handleRightClick} className={props.view === "details" ? "playback-big" : "playback-small"}>
            <div className='tooltip-container'>
              {isTooltipVisible? <ToolTip md={props.cmmco.md} start={props.cmmco.start} end={props.cmmco.end} />:""}
              </div>
              {props.deletable?<i className="fa fa-sm fa-trash" onClick={()=>deleteitem()} type="button"></i>:""}
            <div className={cmmco.start===""?"card bg-cmmco":"card bg-light"}  style={{width: "100%"}}>
                <div className="card-body">
                    <div className='border-1 border rounded-3'>
                        <Multimedia view={props.view} mmco={cmmco.mmco} start={cmmco.start} end={cmmco.end} timecode={timeCode} setTimeCode={setTimeCode} />
                        {/*<Controls setTimeCode={setTimeCode} />*/}
                        <div><i className="fa fa-chevron-down fsize fa-2xs"onClick={() => setWsdUnfolded(!wsdUnfolded)}></i></div>   
                            {wsdUnfolded ? <WsdPlayback ></WsdPlayback>: ""}
                        <div><i className="fa fa-chevron-down fsize"onClick={() => setPdUnfolded(!pdUnfolded)}></i></div>
                            {pdUnfolded ? <PdPlayback pd={cmmco.pd} start={cmmco.mmco.start} timecode={timeCode}></PdPlayback> :""}  
                   </div>    
                </div>
            </div>    
        </div> 
    );

}

export default Playback;