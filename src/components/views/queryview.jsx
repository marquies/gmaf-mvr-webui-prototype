import React, { useState, useEffect } from 'react';
import Query from './query/query/query';
import Presentation from './query/presentation/presentation';
import config from '../../config/config';
import GMAFAdapter from '../../js/GMAFAdapter';

function QueryView(props) {

  const [filter, setFilter] = useState(false);
  const [queryResults, setQueryResults] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    console.log("Filter: ", filter);
    setShowResults(queryResults);
  }, [filter]); // Multiple dependencies

  useEffect(() => {
  
    setShowResults(queryResults);
  }, [queryResults]); // Multiple dependencies


  async function query(cmmcoQuery){

    cmmcoQuery=await cmmcoQuery;
  
    var gmaf= await GMAFAdapter.getInstance();

    if(gmaf===false){
      return;
    }

    var results= await gmaf.query(cmmcoQuery, props.updateStatus);
    console.log("results", results);
    setQueryResults(results);
  }
    return (
        <div className='d-flex query-view flex-start'>
            <Query query={query} setFilter={setFilter}/>
            <Presentation cmmcos={queryResults} presentationView={props.presentationView}/>
        </div>
    );
  }
  
  export default QueryView;