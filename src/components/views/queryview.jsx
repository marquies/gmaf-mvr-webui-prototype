import React, { useState, useEffect } from 'react';
import Query from './query/query/query';
import Presentation from './query/presentation/presentation';
import GMAFAdapter from '../../js/GMAFAdapter';
import DetailsSelector from './query/presentation/views/detailsSelector';


const BATCH_SIZE = 20;

function QueryView(props) {

  const [cmmcoQuery, setCmmcoQuery] = useState(false);
  const [queryResults, setQueryResults] = useState(false);
  const [key, setKey] = useState(false);
  const [firstQueryMade, setFirstQueryMade] = useState(false);
  const [numOfAllResults, setNumOfAllResults] = useState(0);
  const [selectedItem, setSelectedItem] = useState(false);
  const [queryExamples, setQueryExamples] = useState([]);

  async function query(cmmcoQuery){
    const gmaf = await GMAFAdapter.getInstance();
    if (gmaf === false) {
      return;
    }
    showResults(await gmaf.query({ "cmmcoQuery": cmmcoQuery }, props.updateStatus));
  }

  async function similarity(id){
    const gmaf = await GMAFAdapter.getInstance();
    if (gmaf === false) {
      return;
    }
    showResults(await gmaf.similarity(id, props.updateStatus));
  }

  // Shows the first batch right away and streams in the rest
  async function showResults(results) {
    setKey(Math.random());
    setFirstQueryMade(true);
    setNumOfAllResults(results.totalResults);

    const initialBatch = await results.fetchMinimalBatch(0, BATCH_SIZE);
    setQueryResults([...initialBatch]);

    for (let i = BATCH_SIZE; i < results.totalResults; i += BATCH_SIZE) {
      const batch = await results.fetchMinimalBatch(i, BATCH_SIZE);
      setQueryResults(prev => [...prev, ...batch]);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }

  const handleSelectItem = (item) => {
    setSelectedItem(item);
  }

  const handleAddQueryExample = (cmmco) => {
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
              similarity={similarity}
              setCmmcoQuery={setCmmcoQuery}
              queryExamples={queryExamples}
              onRemoveExample={handleRemoveQueryExample}
            />
            {queryResults.length>0 || !firstQueryMade? 
            <Presentation 
              numOfAllResults={numOfAllResults}
              key={key}
              cmmcos={queryResults}
              presentationView={props.presentationView}
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