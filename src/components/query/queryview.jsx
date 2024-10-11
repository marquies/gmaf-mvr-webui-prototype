import React, { useState, useEffect } from 'react';
import Query from './query';
import Presentation from '../presentation/presentation';

function QueryView(props) {

  const [filter, setFilter] = useState(false);

  useEffect(() => {
    console.log("Filter: ", filter);
  }, [filter]); // Multiple dependencies


    return (
    
        <div className='d-flex query-view flex-start'>
            <Query setFilter={setFilter}/>
            <Presentation presentationView={props.presentationView}/>
        </div>
    );
  }
  
  export default QueryView;