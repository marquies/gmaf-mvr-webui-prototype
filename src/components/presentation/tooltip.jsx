import React, {} from 'react';

function ToolTip(props){

function canRender(){
    return true;
}

return (
    <div className='custom-tooltip border-1 border rounded-3'>
     {canRender()?
     <div className='p-1'>
        <div className='text-overflow-cut'>id: {props.md.id}</div>
        <div className='text-overflow-cut'>name: {props.md.name}</div>
        <div className='text-overflow-cut'>creation date: {props.md.creationDate}</div>
        <div className='text-overflow-cut'>desricption: {props.md.description}</div>
    </div>
         :""
    }
    </div>
);

}

export default ToolTip;


