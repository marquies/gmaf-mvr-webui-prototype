import React, { useState, useEffect } from 'react';
import Query from './query';
import Presentation from '../presentation/presentation';
import config from '../config/config';
import GMAFAdapter from '../../js/GMAFAdapter';

function QueryView(props) {

  const [filter, setFilter] = useState(false);
  const [queryResults, setQueryResults] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    console.log("Filter: ", filter);
  }, [filter]); // Multiple dependencies


  async function query(cmmcoQuery){

    cmmcoQuery=await cmmcoQuery;
    console.log("query: ", cmmcoQuery);
    var gmaf= await GMAFAdapter.getInstance();
    console.log(gmaf);
    if(gmaf===false){
      return;
    }
    var results= await gmaf.query(cmmcoQuery);
    console.log("results: ", results);


  }
    return (
        <div className='d-flex query-view flex-start'>
            <Query query={query} setFilter={setFilter}/>
            <Presentation presentationView={props.presentationView}/>
        </div>
    );
  }
  
  export default QueryView;