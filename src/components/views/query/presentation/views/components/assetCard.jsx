import React, { useEffect, useState} from 'react';
import Multimedia from './multimedia';
import ToolTip from './tooltip';
import PdPlayback from './pdplayback';
import WsdPlayback from './wsdplayback';
import GMAFAdapter from '../../../../../../js/GMAFAdapter';


function AssetCard(props){

const [wsdUnfolded, setWsdUnfolded] = useState(false);
const [pdUnfolded, setPdUnfolded] = useState(false);
const [timeCode, setTimeCode] = useState(props.cmmco.start);
const [isTooltipVisible, setIsTooltipVisible] = useState(false);
const {cmmco} = props;


  // Ref to store the timeout ID
  //const hoverTimeout = useRef(null);

  const handleRightClick = (event) => {
   event.preventDefault(); // Prevent the default context menu
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
       setIsTooltipVisible(false);
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
        <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} /*onContextMenu={handleRightClick}*/ className={props.view === "details" ? "playback-big" : "playback-small"}>
            <div className='tooltip-container'>
              {isTooltipVisible? <ToolTip md={props.cmmco.md} start={props.cmmco.start} end={props.cmmco.end} />:""}
              </div>
              {props.deletable?<i className="fa fa-sm fa-trash" onClick={()=>deleteitem()} type="button"></i>:""}
            <div 
                className={`card m-2 ${props.isSelected ? 'border-primary shadow-lg' : ''} hover-effect`} 
                style={{ 
                    width: "100%", 
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out'
                }} yy
                onClick={props.onSelect}
                onMouseEnter={(e) => e.currentTarget.classList.add('shadow', 'bg-light')}
                onMouseLeave={(e) => e.currentTarget.classList.remove('shadow', 'bg-light')}
            >
              <div className="card-header bg-light">
                <p className="small text-muted mb-0" style={{
                  display: '-webkit-box',
                  WebkitLineClamp: '3',
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  minHeight: '4.5em',
                  lineHeight: '1.5em'
                }}>{cmmco?.generalMetadata?.fileName}</p>
              </div>
                <div className="card-body">
                    <div className='border-1 border rounded-3'>
                        <Multimedia view={props.view} mmco={cmmco} start={cmmco.start} end={cmmco.end} timecode={timeCode} setTimeCode={setTimeCode} />
                        {/*<Controls setTimeCode={setTimeCode} />*/}
                        {cmmco.pd && Object.keys(cmmco.pd).length > 0 && (
                            <>
                                <div className="d-flex align-items-center">
                                    <i className="fa fa-chevron-down fsize me-2" onClick={() => setPdUnfolded(!pdUnfolded)}></i>
                                    <div>
                                        <p className="text-muted small mb-0">Peripheral Data</p>
                                    </div>
                                </div>
                                {pdUnfolded ? <PdPlayback pd={cmmco.pd} start={cmmco.start} timecode={timeCode}></PdPlayback> :""}
                            </>
                        )}
                        {cmmco.wsd && Object.keys(cmmco.wsd).length > 0 && (
                            <>
                                <div className="d-flex align-items-center">
                                    <i className="fa fa-chevron-down fsize me-2" onClick={() => setWsdUnfolded(!wsdUnfolded)}></i>
                                    <div>
                                        <p className="text-muted small mb-0">World Specific Data</p>
                                    </div>
                                </div>
                                {wsdUnfolded ? <WsdPlayback></WsdPlayback> : ""}
                            </>
                        )}
                   </div>    
                </div>
            </div>    
        </div> 
    );

}

export default AssetCard;