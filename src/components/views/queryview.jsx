import React, { useState, useEffect } from 'react';
import Query from './query/query/query';
import Presentation from './query/presentation/presentation';
import GMAFAdapter from '../../js/GMAFAdapter';


function QueryView(props) {

  const [filter, setFilter] = useState(false);
  const [queryResults, setQueryResults] = useState(false);
  //const [showResults, setShowResults] = useState(false);
  const [key, setKey] = useState(Math.random()); 
  const [page, setPage] = useState(1); 
  const [numberOfPages, setNumberOfPages] = useState(1);

  useEffect(() => {
  
    setKey(Math.random());
    
  }, [queryResults]); 


  useEffect(() => { 
    //query({});
  }, []);

  async function query(cmmcoQuery){

    var query= {"cmmcoQuery":cmmcoQuery, "filter": filter};
  
    var gmaf= await GMAFAdapter.getInstance();

    if(gmaf===false){
      return;
    }

    var results= await gmaf.query(query, props.updateStatus);

    //setKey(Math.random());
    console.log(results);
    setPage(results.page);
    
    setNumberOfPages(results.numberOfPages);
    setQueryResults(results.results);

  }
    return (
        <div className='d-flex query-view flex-start'>
            <Query query={query} setFilter={setFilter}/>
            {queryResults.length>0?<Presentation updateStatus={props.updateStatus} page={page} numberOfPages={numberOfPages} key={key} cmmcos={queryResults} presentationView={props.presentationView}  deletable={false} se/>:<h2 className='ms-5'>No  machting results found</h2>}
        </div>
    );
  }
  
  export default QueryView;