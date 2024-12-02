import React, { useState, useRef, useEffect } from 'react';
import Presentation from './query/presentation/presentation';
import GMAFAdapter from '../../js/GMAFAdapter';

function CollectionView(props) {

  const [queryResults, setQueryResults] = useState(false);
  //const [showResults, setShowResults] = useState(false);
  const [key, setKey] = useState(false); 
  const [page, setPage] = useState(1); 
  const [numberOfPages, setNumberOfPages] = useState(1);
  const isInitialized = useRef(false);

  useEffect(() => {


    //getCollection();
    if (!isInitialized.current) {
      getCollection();
      isInitialized.current = true;
    }

  }, []);


  async function getCollection(cmmcoQuery){
  
    var gmaf= await GMAFAdapter.getInstance();

    if(gmaf===false){
      return;
    }

    var results= await gmaf.getCollection(props.updateStatus);
    setKey(Math.random());
    setPage(results.page);
    setNumberOfPages(results.numberOfPages);
    setQueryResults([...results.results]);

  }

   function addItem(){

    document.getElementById('file-input-collection').click();
   
  }

  function deleteItem(id){

    console.log("IN CALLBACK");
    var deletedItems= queryResults.filter((item) => item.md.id !== id);
    console.log("Deleted Items")
    setQueryResults(deletedItems);
    setKey(Math.random());
  }

  async function fileUploaded(e){
  
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
    {/*<Presentation cmmcos={showResults} presentationView={"Browse View"} deletable={true} deleteItem={deleteItem}/> */}
    {queryResults.length>0 || !isInitialized.current?<Presentation updateStatus={props.updateStatus} page={page} numberOfPages={numberOfPages} key={key} cmmcos={queryResults} presentationView={"Browse View"} deleteItem={deleteItem} deletable={true} se/>:<h2 className='ms-5'>No Collection Elements found results found</h2>}
  </div>
  </div>
  );
}

export default CollectionView;