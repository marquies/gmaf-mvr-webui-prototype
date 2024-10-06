import React, { Component, useState, useEffect} from 'react';
import Sketch from './old/sketch';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


function Filter(props){

    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

function typeChanged(type) {

}

useEffect(() => {
    var filter=
        {name: name, type: type, fromDate: fromDate, toDate: toDate};
    props.setFilter(filter);
  }, [name, type, fromDate, toDate]); // Multiple dependencies


return (
    <div>
        <h5 className="card-title mt-1">Filter</h5>
        <div class="input-group mb-1">
            <div class="input-group-prepend filter-prepend">
                <span class="input-group-text">By name</span>
            </div>
            <input type="text" class="form-control filter-input" onChange={(name)=> setName(name.target.value)} aria-label=""></input>
        </div>
        <div class="input-group mb-1">
            <div class="input-group-prepend filter-prepend">
                <span class="input-group-text">from Date</span>
            </div>
            <DatePicker className="form-control datepicker filter-input" selected={fromDate} onChange={(date) => setFromDate(date)} />
        </div>
        <div class="input-group mb-1">
            <div class="input-group-prepend filter-prepend">
                <span class="input-group-text">to Date</span>
            </div>
            <DatePicker  className="form-control datepicker filter-input" selected={toDate} onChange={(date) => setToDate(date)} />
        </div>
        <div className='query-menu mt-1'>
            <div className="dropdown">
                <button id="filter-button" className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    {type==="" ? "No type filter" : type}
                </button>
                <ul className="dropdown-menu">
                    <li><button onClick={(type)=> setType("Image")} className="dropdown-item">Image</button></li>
                    <li><button onClick={(type)=> setType("Video")} className="dropdown-item">Video</button></li>
                    <li><button onClick={(type)=> setType("Video2D")} className="dropdown-item">Video 2D</button></li>
                    <li><button onClick={(type)=> setType("Video3D")} className="dropdown-item">Video 3D</button></li>     
                    <li><button onClick={(type)=> setType(false)} className="dropdown-item">No type filter</button></li>
                </ul>
            </div>
        </div>
    </div>
);

}

export default Filter;