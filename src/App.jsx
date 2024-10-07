import React, { Component , useState} from 'react';
import QueryView from './components/queryview';
import CollectionView from './components/collectionview';

import Presentation from './components/old/presentation';
import Query from './components/query';
import GMAFAdapter from "./js/GMAFAdapter";
import Model from './js/Model';
import QueryNew from './components/query';
import "font-awesome/css/font-awesome.min.css";
import "./css/styles.css";


function App() {

  const [view, setView] = useState("Query"); 

  function changeView(view){
    setView(view);
  }

  return (
    <div className='app-container m-2'>
      <div className="dropdown m-1">
          <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
             {view}
          </button>
          <ul className="dropdown-menu">
              <li><button onClick={()=>changeView("Query")} className="dropdown-item" >Query</button></li>
              <li><button onClick={()=>changeView("Collection")} className="dropdown-item" >Collection</button></li>
          </ul>
      </div>
      <div>
      { view === "Query" ? <QueryView /> : <CollectionView /> }
      </div>
    </div>
  );
}

export default App;