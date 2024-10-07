import React, { useState} from 'react';


function NoPlugin() {
    
    function canRender(){
        return true;
    }

    return (
        <div>
            <div className='h-100 d-flex align-items-center justify-content-center'>
                <div className='mt-5'>
                    <div className='h-100 d-flex align-items-center justify-content-center'>
                        <i className="fa fa-3x fa-folder-open"></i>
                    </div>
                        <p>No plugins installed...</p>
                </div>
            </div>
        </div>
       
    );

}

export default NoPlugin;