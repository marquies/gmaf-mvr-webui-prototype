import React, { useEffect, useState} from 'react';
import Multimedia from './multimedia';
import WsdQuery from '../query/wsdquery';
import PdPlayback from './pdplayback';
import WsdPlayback from './wsdplayback';


function Playback(props){

const [wsdUnfolded, setWsdUnfolded] = useState(false);
const [pdUnfolded, setPdUnfolded] = useState(false);
const [timeCode, setTimeCode] = useState(0);

useEffect(() => {
    console.log("Timecode in Parent: ", timeCode);
}, [timeCode]);

return (
    
        <div className={props.view === "details" ? "playback-big" : "playback-small"}>
            <div className="card" style={{width: "100%"}}>
                <div className="card-body">
                    <div className='border-1 border rounded-3'>
                        <Multimedia view={props.view} mmco={props.cmmco.mmco} setTimeCode={setTimeCode} si/>
                        {/*<Controls setTimeCode={setTimeCode} />*/}
                        <div><i class="fa fa-chevron-down"onClick={() => setWsdUnfolded(!wsdUnfolded)}></i></div>   
                            {wsdUnfolded ? <WsdPlayback ></WsdPlayback>: ""}
                        <div><i class="fa fa-chevron-down"onClick={() => setPdUnfolded(!pdUnfolded)}></i></div>
                            {pdUnfolded ? <PdPlayback data={props.cmmco.pd} timecode={timeCode}></PdPlayback> :""}     
                   </div>    
                </div>
            </div>    
        </div> 
    );

}

export default Playback;