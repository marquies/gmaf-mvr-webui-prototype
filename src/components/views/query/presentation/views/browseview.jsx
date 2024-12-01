import React, { useEffect, useState} from 'react';
import Playback from './components/playback';
import GMAFAdapter from '../../../../../js/GMAFAdapter';


function BrowseView(props){

const [paginationState, setPaginationState] = useState(props.page); 
const [numberOfPages, setNumberOfPages] = useState(props.numberOfPages);
const [_, setRerender] = useState(0);
const itemsPerPage=8;
const [cmmcos, setCmmcos] = useState(props.cmmcos);

function canRender(){
   
    //console.log("NUMO OF PAGES HERE"+numberOfPages);
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
    
    if(paginationState===numberOfPages){
        document.getElementById("next-button").className="page-item disabled";
    }else
    {
        document.getElementById("next-button").className="page-item";
    }
    


    }, [cmmcos,paginationState]);



async function handlePagination(requestedPage) {

    console.log("num of", numberOfPages);
    if (requestedPage > numberOfPages || requestedPage < 1) {
        console.log("Invalid Page");
        return; // Prevent invalid pages
    }

    var gmaf= await GMAFAdapter.getInstance();

    if(gmaf===false){
      return;
    }

    var results= await gmaf.getPage(requestedPage,8, props.updateStatus);
    var currentPage= results.page;
    //console.log(results);
    //setKey(Math.random());
    console.log(results.results);
    setCmmcos(results.results);
    setPaginationState(currentPage); 

}

return (
  <div>
     {props.cmmcos.length>0? <nav aria-label="Page navigation example">
        <ul className="pagination">
            <li id="prev-button" onClick={()=>handlePagination(paginationState-1)} className="page-item"><button className="page-link" >Previous</button></li>  
            <li id="pagi2" className="page-item"><button className="page-link" >{paginationState}</button></li>   
            <li id="next-button" onClick={()=>handlePagination(paginationState+1)} className="page-item"><button className="page-link" >Next</button></li>
        </ul>
    </nav>:""
    }
     {canRender()?
    <div className='d-flex flex-wrap flex-start gap'>
       
        {cmmcos.map((cmmco, index) => (
            canRender(index)? <Playback key={cmmco.md.id+"-"+cmmco.selectedScene} cmmco={cmmco} id={cmmco.md.id} view={"browse"} deletable={props.deletable} deleteItem={props.deleteItem}/>: null
        ))}
     
    </div>
       :""
    }
       
    </div>
);

}

export default BrowseView;