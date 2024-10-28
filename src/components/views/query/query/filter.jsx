import React, { Component, useState, useEffect} from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


function Filter(props){

    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");


useEffect(() => {
    var filter=
        {name: name, type: type, fromDate: fromDate, toDate: toDate};
    props.setFilter(filter);
  }, [name, type, fromDate, toDate]); // Multiple dependencies


return (
    <div>
        <h5 className="card-title mt-1">Filter</h5>
        <div className="input-group mb-1">
            <div className="input-group-prepend filter-prepend">
                <span className="input-group-text">Name</span>
            </div>
            <input type="text" className="form-control filter-input" onChange={(name)=> setName(name.target.value)} aria-label=""></input>
        </div>
        <div className='d-flex'>
            <div className='w-25 me-1'>
            <div className="input-group">
                <div className="input-group-prepend w-100">
                    <span className="input-group-text w-100">From</span>
                </div>
                <DatePicker className="form-control datepicker filter-input" selected={fromDate} onChange={(date) => setFromDate(date)} />
            </div>
            </div>
            <div className='w-25'>
                <div className="input-group">
                    <div className="input-group-prepend w-100">
                        <span className="input-group-text w-100">To</span>
                    </div>
                    <DatePicker  className="form-control datepicker filter-input" selected={toDate} onChange={(date) => setToDate(date)} />
                </div>
            </div>
        <div className='query-menu ms-2'>
            <div className="dropdown">
                <button id="filter-button" className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    {type==="" ? "No type filter" : type}
                </button>
                <ul className="dropdown-menu">
                    <li><button onClick={(type)=> setType("Image")} className="dropdown-item">Image</button></li>
                    <li><button onClick={(type)=> setType("Video")} className="dropdown-item">Video</button></li>
                    <li><button onClick={(type)=> setType("Video2D")} className="dropdown-item">Video 2D</button></li>
                    <li><button onClick={(type)=> setType("Video3D")} className="dropdown-item">Video 3D</button></li>     
                    <li><button onClick={(type)=> setType("")} className="dropdown-item">No type filter</button></li>
                </ul>
            </div>
        </div>
        </div>
    </div>
);

}

export default Filter;