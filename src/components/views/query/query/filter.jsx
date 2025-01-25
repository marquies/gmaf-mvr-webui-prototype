import React, { useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Filter(props) {
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [name, setName] = useState("");
    const [type, setType] = useState("");

    const handleNameChange = (event) => {
        const newName = event.target.value;
        console.log(newName);
        setName(newName);
        props.setFilter({
            name: newName,
            fromDate,
            toDate,
            type
        });
    };

    const handleDateChange = (dateType, date) => {
        if (dateType === 'from') {
            setFromDate(date);
        } else {
            setToDate(date);
        }
        props.setFilter({
            name,
            fromDate: dateType === 'from' ? date : fromDate,
            toDate: dateType === 'to' ? date : toDate,
            type
        });
    };

    const handleTypeChange = (newType) => {
        setType(newType);
        props.setFilter({
            name,
            fromDate,
            toDate,
            type: newType
        });
    };

    return (
    <div>
        <div className="input-group mb-1">
            <div className="input-group-prepend filter-prepend">
                <span className="input-group-text">Filename</span>
            </div>
            <input 
                type="text" 
                className="form-control filter-input" 
                onChange={handleNameChange}
                value={name}
                aria-label="">
            </input>
        </div>
        <div className='d-flex'>
          <div className='w-25 me-1'>
            <div className="input-group">
                <div className="input-group-prepend w-100">
                    <span className="input-group-text w-100">From</span>
                </div>
                <DatePicker 
                    className="form-control datepicker filter-input" 
                    selected={fromDate} 
                    onChange={(date) => handleDateChange('from', date)}
                    maxDate={toDate} />
            </div>
            </div>
            <div className='w-25'>
                <div className="input-group">
                    <div className="input-group-prepend w-100">
                        <span className="input-group-text w-100">To</span>
                    </div>
                    <DatePicker  
                        className="form-control datepicker filter-input" 
                        selected={toDate} 
                        onChange={(date) => handleDateChange('to', date)}
                        minDate={fromDate} />
                </div>
            </div>
        <div className='query-menu ms-2'>
            <div className="dropdown">
                <button id="filter-button" className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    {type==="" ? "No type filter" : type}
                </button>
                <ul className="dropdown-menu">
                    <li><button onClick={() => handleTypeChange("Image")} className="dropdown-item">Image</button></li>
                    <li><button onClick={() => handleTypeChange("Video")} className="dropdown-item">Video</button></li>
                    <li><button onClick={() => handleTypeChange("MVR")} className="dropdown-item">MVR</button></li> 
                    <li><button onClick={() => handleTypeChange("")} className="dropdown-item">No type filter</button></li>
                </ul>
            </div>
        </div>
        </div>
    </div>
    );
}

export default Filter;