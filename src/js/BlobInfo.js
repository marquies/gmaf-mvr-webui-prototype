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

    static isBase64Media(src) {
        // Regular expression to match Base64 data URLs for images, videos, and audio
        const base64Pattern = /^data:(image|video|audio)\/(png|jpeg|jpg|gif|bmp|webp|mp4|webm|ogg|mpeg|mp3|wav|aac);base64,/;
        
        // Check if src matches the base64 media pattern
        if (base64Pattern.test(src)) {
            return src;  // It's a Base64 media URL, return the src
        } else {
            return null;  // Not a valid Base64 media URL
        }
    }

}

export default BlobInfo;