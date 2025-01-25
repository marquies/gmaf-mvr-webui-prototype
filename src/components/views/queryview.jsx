import React, { useState, useEffect } from 'react';
import Query from './query/query/query';
import Presentation from './query/presentation/presentation';
import GMAFAdapter from '../../js/GMAFAdapter';
import Details2 from './query/presentation/views/details';


function QueryView(props) {

  const [filter, setFilter] = useState(false);
  const [cmmcoQuery, setCmmcoQuery] = useState(false);
  const [queryResults, setQueryResults] = useState(false);
  //const [showResults, setShowResults] = useState(false);
  const [key, setKey] = useState(false); 
  const [page, setPage] = useState(1); 
  const [numberOfPages, setNumberOfPages] = useState(1);
  const [firstQueryMade, setFirstQueryMade] = useState(false);
  const [numOfAllResults, setNumOfAllResults] = useState(0);
  const [selectedItem, setSelectedItem] = useState(false);

  async function query(cmmcoQuery){

    var query= {"cmmcoQuery":cmmcoQuery, "filter": filter};

    console.log("Query: ", query);
    
    var gmaf= await GMAFAdapter.getInstance();

    if(gmaf===false){
      return;
    }

    var results= await gmaf.query(query, props.updateStatus);

    console.log("Results: ", results);

    setKey(Math.random());
    //setPage(results.page);
    //setNumberOfPages(results.numberOfPages);
    setQueryResults([...results.results]);
    setFirstQueryMade(true);
    setNumOfAllResults(results.numOfAllResults); 

  }
  const handleSelectItem = (item) => {
    setSelectedItem(item);
    console.log("pressed super! " + item);
  }


  useEffect( ()=>{
    if(cmmcoQuery){
      cmmcoQuery.then(cmmcoQuery=>{
          query(cmmcoQuery);
      });
    }
    }, [cmmcoQuery]);


    return (
        <div className='d-flex query-view flex-start gap-3' style={{ minHeight: '100vh' }}>
            <Query query={query} setCmmcoQuery={setCmmcoQuery} setFilter={setFilter}/>
            {queryResults.length>0 || !firstQueryMade? 
            <Presentation 
              numOfAllResults={numOfAllResults} 
              updateStatus={props.updateStatus} 
              page={page} 
              numberOfPages={numberOfPages} 
              key={key} 
              cmmcos={queryResults} 
              presentationView={props.presentationView}  
              deletable={false} 
              onSelectItem={handleSelectItem}
            />:<h2 className='ms-5'>No matching results found</h2>}
            <div className="flex-grow-1" style={{ minWidth: '400px', height: '100vh' }}>
              <Details2 mmfgid={selectedItem}/>
            </div>
        </div>
    );
  }
  
  export default QueryView;