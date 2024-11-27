import React, { useEffect, useState} from 'react';
import Playback from './components/playback';


function BrowseView(props){

const [paginationState, setPaginationState] = useState(1); 
const [showCmmcos, setShowCmmcos] = useState([]); 
const itemsPerPage=8;

const {cmmcos} = props;


function canRender(){

    if(cmmcos === false || typeof(cmmcos) != 'object'){
        //console.log("false or not an object: ", cmmcos);
        return false;
    }

    return true;
}

useEffect(() => {
    if (!cmmcos || typeof cmmcos !== 'object')
    {
        return;
    } 
   
    const startIndex = (paginationState - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    var showCmmcos= cmmcos.slice(startIndex, endIndex);
    console.log(showCmmcos);
    setShowCmmcos(showCmmcos);
    
    if(document.getElementById("prev-button")===null || document.getElementById("next-button")===null){
        return;
    }

    //change Pagination numbers 
    if(paginationState===1){
        document.getElementById("prev-button").className="page-item disabled";
    }else
    {
        document.getElementById("prev-button").className="page-item";
    }
    
    if(paginationState===Math.ceil(cmmcos.length / itemsPerPage)){
        document.getElementById("next-button").className="page-item disabled";
    }else
    {
        document.getElementById("next-button").className="page-item";
    }


    }, [cmmcos,paginationState]);



function handlePagination(currentPage) {
    if (currentPage < 1 || (cmmcos && currentPage > Math.ceil(cmmcos.length / itemsPerPage))) {
        console.log("Invalid Page");
        return; // Prevent invalid pages
    }
    console.log("Pagination State set: ", paginationState);
    setPaginationState(currentPage); 
}

return (
  <div>
     {showCmmcos.length>0? <nav aria-label="Page navigation example">
        <ul className="pagination">
            <li id="prev-button" onClick={()=>handlePagination(paginationState-1)} className="page-item"><button className="page-link" >Previous</button></li>  
            <li id="pagi2" className="page-item"><button className="page-link" >{paginationState}</button></li>   
            <li id="next-button" onClick={()=>handlePagination(paginationState+1)} className="page-item"><button className="page-link" >Next</button></li>
        </ul>
    </nav>:""
    }
     {canRender()?
    <div className='d-flex flex-wrap flex-start gap'>
       
        {showCmmcos.map((cmmco, index) => (
            canRender(index)? <Playback key={cmmco.md.id+"-"+cmmco.selectedScene} cmmco={cmmco} id={cmmco.md.id} view={"browse"} deletable={props.deletable} deleteItem={props.deleteItem}/>: null
        ))}
     
    </div>
       :""
    }
       
    </div>
);

}

export default BrowseView;