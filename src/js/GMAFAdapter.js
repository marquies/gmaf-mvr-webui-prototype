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
        console.log("CollectionIds: ", collectionIds);
        if (typeof collectionIds === 'object') {
            
            //Filter
            var cmmcocollectionIds=[];
            for (let index = 0; index < collectionIds.length; index++) {
                let collectionId = collectionIds[index];
                //if has No origin cmmco == cmmco else tcmmco
                if(!collectionId.cmmco){
                    var cmmcocollectionId = collectionIds[index].id;
                    cmmcocollectionIds.push(cmmcocollectionId);
                }
               
            }

            updateStatus(0, cmmcocollectionIds.length);
         
            for (let index = 0; index < cmmcocollectionIds.length; index++) {
              let collectionId = cmmcocollectionIds[index];
              
              var processResult = await this.processAssetById(collectionId);
           
              updateStatus(index+1, cmmcocollectionIds.length);
            }
        }
    }
    

    async processAssetById(itemid=""){

        return await this.post("gmaf/processAssetById/"+this.apiToken+"/"+itemid,"json");
    }
    
    async getQueryIds(query={}){
      
        return this.post("gmaf/getQueryIds/"+this.apiToken+"/true","json", query);
    }

    async query(query={}, updateStatus)
    {       
        //First get QueryIds
        var result= await this.getQueryIds(query);
        console.log("IDS Result: ",result);
        if(!result)
        {
            console.log("No results received from Query");
            return;
        }
        
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
    

        return {"results":queryResults, "page":result.currentPage, "numberOfPages":result.totalPages, "numOfAllResults":result.allresults.length};
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
    
    return {"results":queryResults, "page":result.currentPage, "numberOfPages":result.totalPages, "numOfAllResults":result.allresults.length};
    
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

        if(!queryId.id){
            console.log("No queryId received from getCMMCO");
        }
        var cache= Cache.getInstance();
    
        //Standard CMMCO
        if(queryId.id && !queryId.originId){

            //Try to Get CMMCO from Cache
            var cmmco= cache.getCmmcos(queryId.id);

            if(cmmco){
            
                return cmmco;   
            }else
            {
                //Get Full Tcmmco
                var cmmco= await this.post("gmaf/getCmmco/"+this.apiToken+"/"+queryId.id,"json");
                cache.addCmmcos(queryId.id, cmmco);
                return cmmco;
            }
        }

        //TCMMCO
        if(queryId.originId){

            //Try to get CMMCO from Cache
            var cmmco= cache.getCmmcos(queryId.originId);
           
            if(!cmmco){
              //console.log("Not from Cache");
               var cmmco = await this.post("gmaf/getCmmco/"+this.apiToken+"/"+queryId.originId,"json");
               cache.addCmmcos(queryId.originId, cmmco);
            }else{
                //console.log("From Cache");
            }
           
            var tcmmco = await this.post("gmaf/getCmmco/"+this.apiToken+"/"+queryId.id,"json");
           
            cmmco["selectedScene"]= tcmmco.selectedScene;
            cmmco["start"]= tcmmco.start;
            cmmco["end"]= tcmmco.end;
            cmmco["md"]["id"]= tcmmco.id;
            return cmmco;

        }
    }


    async getCollection(updateStatus)
    {
         var result= await this.getCollectionIds(false);
         if(!result.results){
            console.log("No results received from Query");
            return;
        }
        console.log("CollectionIds: ", result.results);
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
         //return collectionResults;
    }

    async getCollectionIds(withtcmmcos=false)
    {
        return await this.post("gmaf/get-collection-ids/"+this.apiToken+"/"+withtcmmcos,"json");
    }
    
    async addItemToCollection(filename="", base64file="", inputoverwrite=false){

        return await this.post("gmaf/addItem/"+this.apiToken, false, {name: filename, file :base64file, overwrite: inputoverwrite});
    }

    async deleteItemFromCollection(itemid=""){
    
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