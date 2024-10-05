import React, { useState, useEffect } from 'react';
import Query from './query';
import Presentation from './presentation';

function QueryView() {

  const [filter, setFilter] = useState(false);

  useEffect(() => {
    console.log("Filter: ", filter);
  }, [filter]); // Multiple dependencies

  
    return (
      <div>
        <div className='d-flex'>
            <Query setFilter={setFilter}/>
            <Presentation/>
        </div>
      </div>
    );
  }
  
  export default QueryView;