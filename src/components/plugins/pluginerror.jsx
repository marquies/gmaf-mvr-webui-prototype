import React, { useState} from 'react';


function PlugInError() {
    
    function canRender(){
       return true;
    }

    return (
        <div>
        <div className='h-100 d-flex align-items-center justify-content-center'>
            <div className='mt-5'>
                <div className='h-100 d-flex align-items-center justify-content-center'>
                    <i className="fa fa-3x fa-exclamation"></i>
                </div>
                    <p>Error loading the plugin...</p>
            </div>
        </div>
    </div>
    );

}

export default PlugInError;