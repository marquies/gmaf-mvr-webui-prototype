import React, { Component } from 'react';
import Navbar from "./components/navbar";
import Presentation from './presentation';
import Query from '../query';
import GMAFAdapter from "../../js/GMAFAdapter";
import Model from '../../js/Model';
import QueryNew from '../query';
import "font-awesome/css/font-awesome.min.css";
import "./css/styles.css";


class AppOld extends Component {

    constructor() {
        super()
        this.state = {
          showresults:[], 
        }      
        this.queryChanged= this.queryChanged.bind(this);
        this.filterChanged= this.filterChanged.bind(this);
        this.modeChanged= this.modeChanged.bind(this);
        this.showCollection= this.showCollection.bind(this);
        this.setCollectionState= this.setCollectionState.bind(this);
    } 

    gmafToken= null;

    async componentDidMount(){

      try {

        var gmaf= new GMAFAdapter();
        this.gmafToken= await gmaf.getToken("stw476");
        
      } catch (error) {
        alert("GMAF nicht verknüpft");
      }

    }

    queryresults= [];
    filter= null;
    mode= "static card";

    async queryChanged() {

      if(this.queryEmpty()){

        alert("The query cannot be empty. Specify at least one type");
        return;
      }
          
      var queryObject= this.createQueryObject();

      console.log("queryObject", queryObject);
  
        document.getElementById("loading-spinner").style.display="block";
        try{
          /*
          var gmaf= new GMAFAdapter();
          var token = await gmaf.getToken("stw476");
          gmaf.apiToken= token;
         
        
          var result= await gmaf.query(queryObject);


          console.log("result", result);
          return;
          */
         
          //return;
          //Add all values to queey results
          var presentationModel= new Model(this.gmafToken);
          //var queryresults= await presentationModel.getQuery("Cars");
          var queryresults= await presentationModel.getCollection();


          this.queryresults= queryresults;
       
          //Filter results and show
          this.filterChanged(this.filter);

          document.getElementById("loading-spinner").style.display="none";
        
        } catch (error) {
            document.getElementById("loading-spinner").style.display="none";
            console.error("Error:", error);
      }      
            
  }

  createQueryObject(){

    var obj={};
    var text = document.getElementById("query-textarea").value;
    var files=[];

    if(this.isSet(document.getElementById("query-chosen-image").src)){
      var image = document.getElementById("query-chosen-image").src;
      const imageType = image.match(/data:(.*);base64/)[1];
      files.push({
        type: imageType,
        file: image
      })
    }
    if(this.isSet(document.getElementById("audio-playback").src)){
      var audio= document.getElementById("audio-playback").src;
      const audioType= audio.match(/data:(.*);base64/)[1];
      files.push({
        type: audioType,
        file: audio
      })
    }

    obj.text= text;
    obj.files= files;
    obj.pluginData= [];

    return obj;
  }

  async showCollection(){
    document.getElementById("loading-spinner").style.display="block";
    try{

      var presentationModel= new Model();
      /*
      var gmaf= new GMAFAdapter("stw476");
      var response= await gmaf.getCollection();
      console.log(response);
      return;
      */
      //Add all values to queey results
      var collectionresults= await presentationModel.getCollection();
      this.setState({showresults: collectionresults})
      document.getElementById("loading-spinner").style.display="none";

  }catch (error) {
    document.getElementById("loading-spinner").style.display="none";
    console.error("Error:", error);
}  

}
  isSet(url=""){

    console.log(url);
    if(typeof(url) !== "string"){
      return false;
    }

    if(url===""){
      return false;
    }

    //Check for urls like localhost:3000 thatr react sets that mean NOT set 
    // eslint-disable-next-line
    var regex= /http(s||^$):\/\/[^\/]*\/(.*)/;
    console.log(url.match(regex));

    if(url.match(regex) &&  2 in url.match(regex))
    {
      return false;
    }
    return true;
  }

  filterChanged(filter){

    var queryresults= this.queryresults;
    var showresults= queryresults;

    if(filter && queryresults){
      document.getElementById("filter-button").innerHTML= filter;
      showresults= queryresults.filter((result) => result.type===filter.toLowerCase());

    }else
    {
      document.getElementById("filter-button").innerHTML= "All types";
    }

    this.filter= filter;
    //renders if cardview
    this.setState({showresults: showresults})

    //show dynamic swipe modal
    if(this.mode==="dynamic swipe"){
    
      const swipeToogleButton = document.getElementById('dynamic-swipe-button');
      if(swipeToogleButton){ 
         swipeToogleButton.click();
      }

    }
  }

  setCollectionState(itemid="", changetype="", collection=""){

    if(changetype==="delete"){
      var showresultsCopy= this.state.showresults;
      showresultsCopy= showresultsCopy.filter((item) => item.id!==itemid);
      this.setState({showresults: showresultsCopy})
    }
  }

  modeChanged(mode){

    if(mode){
      document.getElementById("mode-button").innerHTML= mode.charAt(0).toUpperCase() + mode.slice(1);
      this.mode= mode;
    }

}

queryEmpty(){

  if(document.getElementById("query-textarea").value==="" && !this.isSet(document.getElementById("audio-playback").src) && !this.isSet(document.getElementById("query-chosen-image").src) && !this.isSet(document.getElementById("query-chosen-video").src) ){
      return true;
  }
  return false;
}

    render() { 
        return <React.Fragment>
               {/*  <Navbar showCollection={this.showCollection}/>
                <div className='d-flex'>
                } <Query queryChanged={this.queryChanged} filterChanged={this.filterChanged}  modeChanged={this.modeChanged}/>}
                  <QueryNew queryChanged={this.queryChanged} filterChanged={this.filterChanged}  modeChanged={this.modeChanged} plugins={["Plugin1", "Plugin2"]}/>
                  <div id="loading-spinner" style={{"display": "none"}} className="spinner-grow" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                  <Presentation setCollectionState={this.setCollectionState} mode={this.mode} queryresults={this.state.showresults}/> 
                </div>  
                */}

                
              </React.Fragment>;
    }
}
 
export default AppOld;