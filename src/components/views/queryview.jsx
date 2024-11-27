import React, { useState, useEffect } from 'react';
import Query from './query/query/query';
import Presentation from './query/presentation/presentation';
import GMAFAdapter from '../../js/GMAFAdapter';
import Filter from '../../js/Filter';

function QueryView(props) {

  const [filter, setFilter] = useState(false);
  const [queryResults, setQueryResults] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [key, setKey] = useState("23423432432"); //trigger rerender


  useEffect(() => {
  
    var showResults= Filter.filter(queryResults,filter);
    setKey(Math.random());
    setShowResults(showResults);
    
  }, [filter, queryResults]); 


  useEffect(() => { 
    //query({});
  }, []);

  async function query(cmmcoQuery){

    cmmcoQuery=await cmmcoQuery;
  
    var gmaf= await GMAFAdapter.getInstance();

    if(gmaf===false){
      return;
    }
    //Empty Results
   
   
    var results= await gmaf.query(cmmcoQuery, props.updateStatus);
    setKey(Math.random());
    //setPaginationReset(true);
    setQueryResults(results);
  }
    return (
        <div className='d-flex query-view flex-start'>
            <Query query={query} setFilter={setFilter}/>
            <Presentation key={key} cmmcos={showResults} presentationView={props.presentationView}  deletable={false} se/>
        </div>
    );
  }
  
  export default QueryView;