import config from "../config/config";
import Cache from "./Cache";

class GMAFAdapter
{
   
    basePath= "http://localhost:8242/gmaf/gmafApi/";
    getCollectionPath = "gmaf/getCollection/";
    queryPath1= "gmaf/"
    apiToken="";
    static GMAFInstance= false; 

    constructor(apiToken=""){
        this.apiToken= apiToken;
    }

    static async getInstance()
    {
        console.log("INSTANCE INSTANCIATE");
        if(!this.GMAFInstance){
            try{
                var gmaf= new GMAFAdapter();
                var token= await gmaf.getToken(config.appKey);
             
                if(typeof(token) !== "string" || token===""){
                  
                    throw new Error("The Token received was not a string or empty, Token: "+token);
                }
               
            }catch(error){
                console.error("GMAF was not instanciated: "+error);
                return false;
            }
            gmaf.setToken(token);
            this.GMAFInstance= gmaf;
        }

        return this.GMAFInstance;
    }

    setToken(token=""){
        this.apiToken= token;
    }

    async getToken(password="")
    {
        return await this.get("gmaf/getToken/"+password,"", true);
    }

    async processAllAssets(updateStatus)
    {
        var results = await this.getCollectionIds(false);
       
        var collectionIds= results.allresults;
       
        updateStatus(0, collectionIds.length);
        
        if (typeof collectionIds === 'object') {
            
            for (let index = 0; index < collectionIds.length; index++) {
              let collectionId = collectionIds[index];
              console.log("IN PROCESS");
              var processResult = await this.processAssetById(collectionId);
              console.log("Process Result: ", processResult);
              updateStatus(index+1, collectionIds.length);
            }
        }
    }

    async processAssetById(itemid=""){

        return await this.post("gmaf/processAssetById/"+this.apiToken+"/"+itemid,"json");
    }
    
    async getQueryIds(query={}){
        console.log("AUth Token 1: ", this.apiToken);
        return this.post("gmaf/getQueryIds/"+this.apiToken,"json", query);
    }

    async query(query={}, updateStatus)
    {       
        //First get QueryIds
        var result= await this.getQueryIds(query);

        if(!result.results){
            console.log("No results received from Query");
            return;
        }

        var queryIds= result.results;
       
        updateStatus(0, queryIds.length);
        var queryResults= [];
        if (typeof queryIds === 'object') {
            for (let index = 0; index < queryIds.length; index++) {
              var cmmco = await this.getCMMCO(queryIds[index]);
              queryResults.push(cmmco);
              updateStatus(index+1, queryIds.length);
            }
          }
    
        return {"results":queryResults, "page":result.currentPage, "numberOfPages":result.totalPages};
    }

    async getPage(page=1,resultsPerPage=8, updateStatus){
     
    //First get QueryIds
    var result= await this.post("gmaf/getPage/"+this.apiToken+"/"+page+"/"+resultsPerPage +"/","json");

    if(!result.results){
        console.log("No results received from Query");
        return;
    }
  
    var queryIds= result.results;
       
    updateStatus(0, queryIds.length);
    var queryResults= [];
    if (typeof queryIds === 'object') {
        for (let index = 0; index < queryIds.length; index++) {
        var cmmco = await this.getCMMCO(queryIds[index]);
        queryResults.push(cmmco);
        updateStatus(index+1, queryIds.length);
        }
    }

    return {"results":queryResults, "page":result.currentPage, "numberOfPages":result.totalPages};
    
    }

    async getCollectionPage(page=1,resultsPerPage=8, updateStatus){
     
        //First get QueryIds
        var result= await this.post("gmaf/getCollectionPage/"+this.apiToken+"/"+page+"/"+resultsPerPage +"/","json");
    
        if(!result.results){
            console.log("No results received from Query");
            return;
        }
      
        var queryIds= result.results;
           
        updateStatus(0, queryIds.length);
        var queryResults= [];
        if (typeof queryIds === 'object') {
            for (let index = 0; index < queryIds.length; index++) {
            var cmmco = await this.getCMMCO(queryIds[index]);
            queryResults.push(cmmco);
            updateStatus(index+1, queryIds.length);
            }
        }
    
        return {"results":queryResults, "page":result.currentPage, "numberOfPages":result.totalPages};
        
        }


    async getCMMCO(queryId){
       
        //Check for stanrd CMMCO in Cache
        var cache= Cache.getInstance();
        var cmmco= cache.getCmmcos(queryId);

        if(cmmco){
            return cmmco;
        }

        //First get complete CMMCO or reduced Tccmmco
        var cmmco= await this.post("gmaf/getCmmco/"+this.apiToken+"/"+queryId+"/"+false,"json");
        
        //TCMMCO 
        if(cmmco.reduced==true){

            var tcmmco= cmmco;
            //Check if the origin cmmco is already in cache and add playback infos to it
            var cmmco= cache.getCmmcos(tcmmco.originid);
            if(cmmco){
               
                cmmco["selectedScene"]= tcmmco.selectedScene;
                cmmco["start"]= tcmmco.start;
                cmmco["end"]= tcmmco.end;
                cmmco["id"]= tcmmco.queryId;
                return cmmco;

            }else
            {     
                //Get Full Tcmmco
                var cmmco= await this.post("gmaf/getCmmco/"+this.apiToken+"/"+queryId+"/"+true,"json");
                return cmmco;
            }
        }
        
        cache.addCmmcos(queryId, cmmco);
    
        return cmmco;
            
    }


    async getCollection(updateStatus)
    {
         var result= await this.getCollectionIds(false);
         if(!result.results){
            console.log("No results received from Query");
            return;
        }
        
        var queryIds= result.results;
        console.log("GET COLLECTION IDS",queryIds);
        updateStatus(0, queryIds.length);
        var queryResults= [];
        if (typeof queryIds === 'object') {
            for (let index = 0; index < queryIds.length; index++) {
              var cmmco = await this.getCMMCO(queryIds[index]);
              queryResults.push(cmmco);
              updateStatus(index+1, queryIds.length);
            }
          }
    
        return {"results":queryResults, "page":result.currentPage, "numberOfPages":result.totalPages};
         //return collectionResults;
    }

    async getCollectionIds(withtcmmcos=false)
    {
        console.log("AUth Token 1: ", this.apiToken);
        return await this.post("gmaf/get-collection-ids/"+this.apiToken+"/"+withtcmmcos,"json");
    }
    
    async getCollectionMetaData()
    {
        return await this.post("gmaf/getMetadata/"+this.apiToken,"json");
    }
    async getPreviewBlob(itemid)
    {

        return await this.get("gmaf/preview/"+this.apiToken+"/"+itemid, "blob");
    }
    async getPreviewUrl(itemid)
    {
        return await this.post("gmaf/preview/"+this.apiToken+"/"+itemid);
    }

    async addItemToCollection(filename="", base64file="", inputoverwrite=false){

        return await this.post("gmaf/addItem/"+this.apiToken, false, {name: filename, file :base64file, overwrite: inputoverwrite});
    }

    async deleteItemFromCollection(itemid=""){
        console.log("AUth Token 2: ", this.apiToken);
        return await this.post("gmaf/deleteItem/"+this.apiToken+"/"+itemid);
    }
    async get(path="", type="", initial=false)
    {   
        if(!this.apiToken && !initial)
        {
            throw new Error("GMAF Token not set");
        }
        try{

            const response = await fetch(this.basePath+path);
    
            if(type==="blob")
            {
                return await response.blob();    
            }
    
            if(type==="json")
            {
                return await response.json();
            }
            return await response.text();
        }catch (error) {
            if(error.message==="Failed to fetch"){
               // alert("GMAF Service not reachable")
               console.error("GMAF Service not reachable");
            }
            console.error(error);       
        }
       
    }
    async post(path="",jsonResponse=false,body={})
    {
        if(!this.apiToken)
        {
            throw new Error("GMAF Token not set");
        }
        try
        {
            const response = await fetch(this.basePath+path,{
                method: 'POST',
                headers: { },
                body: JSON.stringify(body)
              }
            );
          
            if(jsonResponse)
            {
                var result= await response.json();
                
                if(result.data){
                    return result.data;
                }
               
                if(result.error){
                    throw new Error(result.error);
                }
                
                throw new Error("Response unexepected! : "+result);
            }
           
            return await response.text();

        }catch (error) {
            
            if(error.message==="Failed to fetch"){
                console.error("GMAF Service not reachable");
            }
            console.error(error);       
        }
    }

}

export default GMAFAdapter;