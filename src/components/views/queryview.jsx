import React, { useState, useEffect } from 'react';
import Query from './query/query/query';
import Presentation from './query/presentation/presentation';
import GMAFAdapter from '../../js/GMAFAdapter';
import Filter from '../../js/Filter';

function QueryView(props) {

  const [filter, setFilter] = useState(false);
  const [queryResults, setQueryResults] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
  
    var showResults= Filter.filter(queryResults,filter);
    setShowResults(showResults);
  }, [filter, queryResults]); 


  useEffect(() => { 
    console.log("LOADED QUERY: ");
    query({});
  }, []);

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
            <Presentation cmmcos={showResults} presentationView={props.presentationView}/>
        </div>
    );
  }
  
  export default QueryView;