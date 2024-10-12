import React, { useState} from 'react';
import QueryView from './components/query/queryview';
import CollectionView from './components/collection/collectionview';
import "font-awesome/css/font-awesome.min.css";
import "./css/styles.css";


function App() {

  const [view, setView] = useState("Query"); 
  const [presentationView, setPresentationView] = useState("Browse View"); 

  function changePresentationView(view){
    setPresentationView(view);
  }
  function changeView(view){
    setView(view);
  }

  return (
    <div className='app-container m-2'>
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
      </div>
      { view === "Query" ? <QueryView presentationView={presentationView}/> : <CollectionView /> }
    </div>
  );
}

export default App;