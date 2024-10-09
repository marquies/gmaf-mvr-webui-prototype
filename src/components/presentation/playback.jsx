import React, { useState} from 'react';
import Multimedia from './multimedia';
import WsdQuery from '../query/wsdquery';


function Playback(props){

const [wsdUnfolded, setWsdUnfolded] = useState(false);
const [pdUnfolded, setPdUnfolded] = useState(false);


function typeChanged(type) {

}

return (
    
        <div className='query'>
            <div className="card" style={{width: "100%"}}>
                <div className="card-body">
                    <div className='border-1 border rounded-3'>
                        <Multimedia mmco={props.cmmco.mmco} />
                        <div><i class="fa fa-chevron-down"onClick={() => setWsdUnfolded(!wsdUnfolded)}></i></div>   
                            {wsdUnfolded ? <WsdQuery ></WsdQuery>: ""}
                        <div><i class="fa fa-chevron-down"onClick={() => setPdUnfolded(!pdUnfolded)}></i></div>
                            {pdUnfolded ? <pdPlayback setFilter={props.setFilter}></pdPlayback> :""}     
                   </div>    
                </div>
            </div>    
        </div> 
    );

}

export default Playback;