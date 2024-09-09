class BlobInfo
{
    image= ["jpg", "jpeg", "png", "gif"];
    video= ["mp4", "mov", "quicktime"];
    blob= null;

    constructor(blobinput){
      
        if(typeof(blobinput)!="object")
        {   
            console.error("Blobinfo: No object was inserted, type: "+ typeof(blobinput));
            return;
        }
        this.blob= blobinput;
    }

    getType()
    {
        var type= this.blob.type;

        console.log("type", type);

        var typepaths=  type.split("/");

        if( (typepaths[0] && typepaths[0]==="image") || (typepaths[1] && this.image.includes(typepaths[1].toLowerCase()) ))
        {
            return "image";
        }
        if((typepaths[0] && typepaths[0]==="video") || (typepaths[1] && this.video.includes(typepaths[1].toLowerCase()) ))
        {
            return "video";
        }
      
        return false;
    }

    getPreviewUrl()
    {
       return URL.createObjectURL(this.blob);
    }

}

export default BlobInfo;