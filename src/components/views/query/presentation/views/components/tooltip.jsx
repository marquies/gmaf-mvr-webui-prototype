import React from 'react';

function ToolTip(props){

function canRender(){
    console.log(props);
    return props.md && (props.md.id || props.md.name || props.md.Date);
}

return (
    <div className='custom-tooltip border-1 border rounded-3'>
     {canRender()?
     <div className='p-1'>
        {props.md.id && <div className='text-overflow-cut'>id: {props.md.id}</div>}
        {props.md.name && <div className='text-overflow-cut'>name: {props.md.name}</div>}
        {props.md.Date && <div className='text-overflow-cut'>date: {props.md.Date}</div>}
        {props.start && <div className='text-overflow-cut'>start: {props.start}</div>}
        {props.end && <div className='text-overflow-cut'>end: {props.end}</div>}
    </div>
         :""
    }
    </div>
);

}

export default ToolTip;


