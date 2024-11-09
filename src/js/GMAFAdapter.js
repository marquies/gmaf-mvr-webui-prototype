import config from "../config/config";

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

    async getMetadata()
    {
        return await this.post("gmaf/getMetadata/"+this.apiToken,"json");
    }

    async processAssetById(itemid=""){

        return await this.post("gmaf/processAssetById/"+this.apiToken+"/"+itemid,"json");
    }
    
    async getMetadataForItem(itemid){

        return await this.post("gmaf/getMetadataForItem/"+this.apiToken+"/"+itemid,"json");
    }

    async getQueryIds(query={}){

        return this.post("gmaf/getQueryIds/"+this.apiToken,"json", query);
    }

    async query(query={}, updateStatus)
    {       
        //First get QueryIds
        var queryIds= await this.getQueryIds(query);
      
        var queryResults= [];
        if (typeof queryIds === 'object') {
            for (let index = 0; index < queryIds.length; index++) {
              var cmmco = await this.getCMMCO(queryIds[index]);
              queryResults.push(cmmco);
              updateStatus(index, queryIds.length - 1);
            }
          }
    
        return queryResults;
    }

    async getCMMCO(queryId){

        return this.post("gmaf/getCmmco/"+this.apiToken+"/"+queryId,"json");

    }

    async processAllAssets(updateStatus)
    {
        var collectionIds= await this.getCollectionIds(true);
     
        if (typeof collectionIds === 'object') {
            for (let index = 0; index < collectionIds.length; index++) {
              let collectionId = collectionIds[index];
              var processResult = await this.processAssetById(collectionId);
              console.log("processResult:", processResult);
              console.log(index, collectionIds.length - 1);
              updateStatus(index, collectionIds.length - 1);
            }
          }
    }
    async getCollection()
    {
        return await this.post("gmaf/getCollection/"+this.apiToken,"json");
    }

    async getCollectionIds(withtcmmcos=false)
    {
        return await this.post("gmaf/get-collection-ids/"+withtcmmcos+"/"+this.apiToken,"json");
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
                // alert("GMAF Service not reachable")
                console.error("GMAF Service not reachable");
            }
            console.error(error);       
        }
    }

    async getExampleVideo(url)
    {
        return await this.get(url, "blob");
    }


}

export default GMAFAdapter;