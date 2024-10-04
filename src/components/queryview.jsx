import React, { useState } from 'react';
import Query from './query';
import Presentation from './presentation';

function QueryView() {

  
    return (
      <div>
        <div className='d-flex'>
            <Query/>
            <Presentation/>
        </div>
      </div>
    );
  }
  
  export default QueryView;