import React, { Component } from 'react';
import GMAFAdapter from '../js/GMAFAdapter';

class Navbar extends Component {
    state = {  } 

    fileInput(){

      document.getElementById('file-input-collection').click();

  }

  addFileToCollection(){

     const file= document.getElementById("file-input-collection").files[0];

     if(file){

        const reader = new FileReader();
        reader.onload = async function(e) {

          const base64String = e.target.result.split(',')[1]; 
          var gmaf= new GMAFAdapter("stw476");
          var response= await gmaf.addItemToCollection(file.name, base64String, false);
          console.log(response);
          if(response===""){
              //toggleModal
              document.getElementById("duplicate-modal-toggler").click();
          }
          if(response==="added"){
            alert("Item added successfully to collection");
          }

          //this.props.showCollection();
        };
      reader.readAsDataURL(file); }
  }
  overwrite(){

      const file= document.getElementById("file-input-collection").files[0];
      if(file) {
      const reader = new FileReader();

      reader.onload = async function(e) {

        const base64String = e.target.result.split(',')[1];
        var gmaf= new GMAFAdapter("stw476");
        var response= await gmaf.addItemToCollection(file.name, base64String, true);
        console.log(response);
          if(response==="added"){
            alert("Item added successfully to collection");
          }
      };
      reader.readAsDataURL(file); 
  }
}


    render() { 
        return <nav id="navbar" className="navbar navbar-expand-lg mt-3 navbar-light bg-light">
        <a className="navbar-brand" href="/">GMAF MVR</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item active">
              <a className="nav-link" href="/">Home <span className="sr-only">(current)</span></a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/">Features</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/">Pricing</a>
            </li>
            <li className="nav-item">
              <a className="nav-link disabled" href="/">Disabled</a>
            </li>
            <button onClick={this.props.showCollection} type="button" className='btn border border-secondary rounded-1 m-1'><span className="fa fa-image"></span></button>
            <button onClick={this.fileInput} type="button" className='btn border border-secondary rounded-1 m-1'><span className="fa fa-plus"></span></button>
            <input onChange={this.addFileToCollection} type="file" id="file-input-collection" hidden={true} accept=".png,.jpg,.mp4,.mov"></input>
          </ul>
        </div>
        <button id="duplicate-modal-toggler" type="button" hidden={true} className="btn btn-primary"  data-bs-toggle="modal" data-bs-target="#duplicateModal"></button>
        <div className="modal fade" id="duplicateModal" tabIndex="-1" aria-labelledby="duplicateModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header"> File already exists. Want to overwrite?
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button id="accept-sketch" type="button" onClick={this.overwrite}  data-bs-dismiss="modal" className="btn btn-primary">Proceed</button>
                    </div>
                </div>
            </div>
        </div>
      </nav>
    }
}
 
export default Navbar;