import React, { useState, useEffect } from 'react';
import Presentation from './query/presentation/presentation';
import GMAFAdapter from '../../js/GMAFAdapter';

function CollectionView(props) {

  const [showResults, setShowResults] = useState(false);

  useEffect(() => {


    getCollection();

  
  
  }, []);

  async function getCollection(){
     var gmaf= await GMAFAdapter.getInstance();
    var showResults= await gmaf.getCollection(props.updateStatus);
    setShowResults(showResults);

  }

   function addItem(){

    document.getElementById('file-input-collection').click();
   
  }

  function deleteItem(id){

    console.log("RES HERE", showResults);

    setShowResults((showResults) => showResults.filter((item) => item.md.id !== id));
  }

  async function fileUploaded(e){
    console.log("Before redaer");
    const reader = new FileReader();
    const file = e.target.files[0];

    reader.onload = async function (e) {
      console.log(e);
      const base64String = e.target.result.split(',')[1];
      var filename= file.name;
      var gmaf= await GMAFAdapter.getInstance();
      var result= await gmaf.addItemToCollection(filename, base64String, true);
     
      if(result == "true"){
        getCollection();
        alert("Item added successfully!")
      
      }else
      {
        alert("Item addition failed!")
      }

    };
    reader.readAsDataURL(file);
  }

  return (
    <div>
       <button className="btn btn-secondary m-1" type="button" onClick={addItem}>Add Item</button>
       <input type="file" onChange={(e)=>fileUploaded(e)} hidden id="file-input-collection" accept=".png,.jpg,.jpeg"></input>  
    <div className='d-flex query-view flex-start'>
    <Presentation cmmcos={showResults} presentationView={"Browse View"} deletable={true} deleteItem={deleteItem}/>
  </div>
  </div>
  );
}

export default CollectionView;