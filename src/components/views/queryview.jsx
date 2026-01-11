import React, { useState, useEffect } from 'react';
import Query from './query/query/query';
import Presentation from './query/presentation/presentation';
import GMAFAdapter from '../../js/GMAFAdapter';
import DetailsSelector from './query/presentation/views/detailsSelector';


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
  const [queryExamples, setQueryExamples] = useState([]);

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
    setFirstQueryMade(true);
    setNumOfAllResults(results.totalResults); 

    const batchSize = 20;
    const initialBatch = await results.fetchMinimalBatch(0, batchSize);
    setQueryResults([...initialBatch]);

    if (results.totalResults > batchSize) {
      loadRemainingResults(results, batchSize);
    }
  }

  async function similarity(id){
    console.log("Similarity Query for ID: ", id);
    
    var gmaf= await GMAFAdapter.getInstance();

    if(gmaf===false){
      return;
    }

    var results= await gmaf.similarity(id, props.updateStatus);

    console.log("Similarity Results: ", results);

    setKey(Math.random());
    setFirstQueryMade(true);
    setNumOfAllResults(results.totalResults); 

    const batchSize = 20;
    const initialBatch = await results.fetchMinimalBatch(0, batchSize);
    setQueryResults([...initialBatch]);

    if (results.totalResults > batchSize) {
      loadRemainingResults(results, batchSize);
    }
  }

  async function loadRemainingResults(results, startIndex) {
    const batchSize = 20;
    const totalResults = results.totalResults;
    
    for (let i = startIndex; i < totalResults; i += batchSize) {
      const batch = await results.fetchMinimalBatch(i, batchSize);
      setQueryResults(prev => [...prev, ...batch]);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }
  const handleSelectItem = (item) => {
    setSelectedItem(item);
    console.log("pressed super! " + item);
  }

  const handleAddQueryExample = (cmmco) => {
    // Check if example already exists
    const exists = queryExamples.some(ex => ex.id === cmmco.id);
    if (!exists) {
      setQueryExamples(prev => [...prev, cmmco]);
    }
  }

  const handleRemoveQueryExample = (id) => {
    setQueryExamples(prev => prev.filter(ex => ex.id !== id));
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
            <Query 
              query={query}
              similarity={similarity}
              setCmmcoQuery={setCmmcoQuery} 
              setFilter={setFilter}
              queryExamples={queryExamples}
              onRemoveExample={handleRemoveQueryExample}
            />
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
              onAddQueryExample={handleAddQueryExample}
            />:<h2 className='ms-5'>No matching results found</h2>}
            <div className="flex-grow-1" style={{ minWidth: '400px', height: '100vh' }}>
              <DetailsSelector mmfgid={selectedItem}/>
            </div>
        </div>
    );
  }
  
  export default QueryView;