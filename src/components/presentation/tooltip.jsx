import React, {} from 'react';

function ToolTip(props){

function canRender(){
    console.log("Tooltip rendered");
    return true;
}

return (
    <div className='custom-tooltip border-1 border rounded-3'>
     {canRender()?
     <div>
        <div className='text-overflow-cut'>id: {props.md.id}</div>
        <div className='text-overflow-cut'>name: {props.md.name}</div>
        <div className='text-overflow-cut'>desricption: {props.md.description}</div>
        <div className='text-overflow-cut'>creation date: {props.md.creationDate}</div>
    </div>
         :""
    }
    </div>
);

}

export default ToolTip;


