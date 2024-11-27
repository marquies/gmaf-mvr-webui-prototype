import React, {} from 'react';

function ToolTip(props){

function canRender(){
    console.log(props);
    return true;
}

return (
    <div className='custom-tooltip border-1 border rounded-3'>
     {canRender()?
     <div className='p-1'>
        <div className='text-overflow-cut'>id: {props.md.id}</div>
        <div className='text-overflow-cut'>name: {props.md.name}</div>
        <div className='text-overflow-cut'>date: {props.md.Date}</div>
        {props.start? <div className='text-overflow-cut'>start: {props.start}</div>:""}
        {props.end? <div className='text-overflow-cut'>start: {props.end}</div>:""}
    </div>
         :""
    }
    </div>
);

}

export default ToolTip;


