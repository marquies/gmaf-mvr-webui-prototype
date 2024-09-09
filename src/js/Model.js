import BlobInfo from "./BlobInfo";
import GMAFAdapter from "./GMAFAdapter";

class Model
{
    idInfo=0;
    collectionids=[];
    results=[];
    metaData=[];
    blobs=[];
    gmaf=null;

    constructor(gmafToken=""){

        //this.gmaf= new GMAFAdapter(gmafToken);
        this.gmaf = new GMAFAdapter("stw476");
        //Console.Test

    }


    async getQuery(query=""){

        this.collectionids= await this.gmaf.query(query);
        this.metaData= await this.gmaf.getMetadata();
        
        return await this.getPresentationArray();

    }

    async getPresentationArray(){

        var results= [];
        if(!Array.isArray(this.collectionids))
        {
            console.error("Expected Query Results to be array, received: ", this.collectionids);
        }

        //Metadata
        this.metaData= await this.gmaf.getMetadata();

        for(const itemid of this.collectionids)
        { 
            var metaData=null;
            //Add Metadata
            for (const metaDataObject of this.metaData)
            {
                if(metaDataObject.id===itemid)
                {
                    metaData= metaDataObject;
                }
            }

            //Get Preview
            var previewblob =  await this.gmaf.getPreviewBlob(itemid);  
            var blobinfo= new BlobInfo(previewblob);
            var type= blobinfo.getType();
            var previewUrl= blobinfo.getPreviewUrl();
            var playbacks=[];

            if(type==="video")
            {
                playbacks= [{id:itemid, value:70, playbacksecond:2}, {id:itemid, value:60, playbacksecond:4},{id:itemid, value:30, playbacksecond:5}];
            }

            results.push({type: type, id:itemid, url:previewUrl,playbacks:playbacks, metadata: metaData});
        }
        return results;
    }

    async getCollection(){

        this.collectionids= await this.gmaf.getCollectionIds();
        this.metaData= await this.gmaf.getMetadata();
        
        console.log(this.metaData);
        return await this.getPresentationArray();

    }

    async collectDataForIds(){

    }

    async processItem(itemid=""){
       
        return await this.gmaf.processItem(itemid);

    }

    toPresentationArray(){

    }

}

export default Model;