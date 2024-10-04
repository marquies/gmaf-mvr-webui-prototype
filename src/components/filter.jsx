import React, { Component, useState} from 'react';
import Sketch from './old/sketch';


function Filter(){

function typeChanged(type) {

}


return (
    <div>
        <h5 className="card-title mt-1">Presentation Options</h5>
        <div className='query-menu mt-1'>
            <div className="dropdown m-1">
                <button id="filter-button" className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    All types
                </button>
                <ul className="dropdown-menu">
                    <li><button onClick={typeChanged("Image")} className="dropdown-item">Image</button></li>
                    <li><button onClick={typeChanged("Video")} className="dropdown-item">Video</button></li>
                    <li><button onClick={typeChanged("Video")} className="dropdown-item">Video 2D</button></li>
                    <li><button onClick={typeChanged("Doc")} className="dropdown-item">Video 3D</button></li>     
                    <li><button onClick={typeChanged("All")} className="dropdown-item">All types</button></li>
                </ul>
            </div>
            <div className="dropdown m-1">
                <button id="mode-button" className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                Static Cardview
                </button>
                <ul className="dropdown-menu">
                  { /*<li><button onClick={()=>this.props.modeChanged("static card")} className="dropdown-item" >Static Card</button></li>
                    <li><button onClick={()=>this.props.modeChanged("dynamic swipe")} className="dropdown-item" >Dynamic Swipe</button></li>
                   */ }
                </ul>
            </div>
        </div>
    </div>
);









}

export default Filter;