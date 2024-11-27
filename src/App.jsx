import React, { useState} from 'react';
import QueryView from './components/views/queryview';
import CollectionView from './components/views/collectionview';
import "font-awesome/css/font-awesome.min.css";
import "./css/styles.css";
import GMAFAdapter from './js/GMAFAdapter';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {

  const [view, setView] = useState("Query"); 
  const [presentationView, setPresentationView] = useState("Browse View"); 
  const [status, setStatus] = useState(-1); 
  const [statuslength, setStatusLength] = useState(0);


  function changePresentationView(view){
    setPresentationView(view);
  }
  function changeView(view){
    setView(view);
  }

  function updateStatus(status, length){
   
    setStatus(status);
    setStatusLength(length);
  }

  async function processAllAssets(){

    var gmaf= await GMAFAdapter.getInstance();
   
    if(gmaf===false){
      return;
    }

    gmaf.processAllAssets(updateStatus);
  
  }

  return (
    <div className='app-container m-2'>
      {status >= 0 && statuslength!==status ?
        <div className="progress">
        <div className="progress-bar" role="progressbar"   style={{ width: `${statuslength > 0 ? (status / statuslength) * 100 : 0}%` }} aria-valuenow={status} aria-valuemin="0" aria-valuemax={statuslength}></div>
      </div>:""
      }
      <div className='d-flex'>
        <div className="dropdown m-1">
            <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              {view}
            </button>
            <ul className="dropdown-menu">
                <li><button onClick={()=>changeView("Query")} className="dropdown-item" >Query</button></li>
                <li><button onClick={()=>changeView("Collection")} className="dropdown-item" >Collection</button></li>
            </ul>
        </div>

       { view === "Query" ?
        <div className="dropdown m-1">
          <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              {presentationView}
          </button>
          <ul className="dropdown-menu">
              <li><button onClick={()=>changePresentationView("Browse View")} className="dropdown-item" >Browse View</button></li>
              <li><button onClick={()=>changePresentationView("Details View")} className="dropdown-item" >Details View</button></li>
          </ul>
        </div>:
        ""
        }
        <button onClick={()=>processAllAssets()} className="btn btn-secondary m-1" type="button" aria-expanded="false">
          Process all Assets
        </button>
      </div>
      { view === "Query" ? <QueryView updateStatus={updateStatus} presentationView={presentationView}/> : <CollectionView updateStatus={updateStatus} /> }
    </div>
  );
}

export default App;