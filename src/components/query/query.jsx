import React, { useEffect, useState} from 'react';
import Filter from './filter';
import WsdQuery from './wsdquery';



function Query(props) {
    
    const [text, setText] = useState(""); 
    const [image, setImage] = useState(null);  
    const [imageurl, setImageurl] = useState("");
    const [audio, setAudio] = useState(null);
    const [audiourl, setAudiourl] = useState("");
    const [wsd, setWsd] = useState(null);
    const [wsdUnfolded, setWsdUnfolded] = useState(null);
    const [filterUnfolded, setFilterUnfolded] = useState(null);
   

    const [pluginSelected, setPluginSelected] = useState(0);

    function textChange(event) {
        setText(event.target.value);
    }    

    function imageInput() {
        //for styled buttons trigger hiddenfield here
        document.getElementById('image-input').click();
    }

    function audioInput() {
        //for styled buttons trigger hiddenfield here
        document.getElementById('audio-input').click();
    }

    function imageUploaded(event) {
        const file = event.target.files[0];
        if (file) {
            setImage(file);
        }
    }

    //Update Preview
    useEffect(() => {
    var url= image? URL.createObjectURL(image):"";
    setImageurl(url);
    }, [image]);


    function audioUploaded(event) {
        const file = event.target.files[0];
        if (file) {
            setAudio(file);
        }
    }

    //Update Preview
    useEffect(() => {
        var url= audio? URL.createObjectURL(audio):"";
        setAudiourl(url);
    }, [audio]);


    function clearImage() {
        setImage(null);
    }

    function clearText() {
        setText("");
    }

    function clearAudio() {
       setAudio(null);
    }

    function clearAll() {
        setText("");
        setImage(null);
        setAudio(null);
    }
    
   async function createMmcoQuery() {

        var imageObj=  image? await fileInputToMmmcoObject(image):null;
        
        var audiObj = audio? await fileInputToMmmcoObject(audio):null;
        var images= imageObj?[imageObj]:[];
        var audios = audiObj?[audiObj]:[];

        const mmco={
            images: images,
            audios: audios,
        }
        const cmmcoQuery = {
            srd:{},
            pd:{},
            mmco:mmco,
            md:{description: text},
            wsd:{}
        }
        return cmmcoQuery;
    }

    function fileInputToMmmcoObject(file){

        return new Promise((resolve) => {
            // Read the file as an ArrayBuffer
            const reader = new FileReader();
            reader.onload = (e) => {

                const base64String = e.target.result.split(',')[1];
                
                var mmcoObj={
                    filename: file.name,
                    filesize: file.size,
                    filetype: file.type,
                    lastmodiied:file.lastModifiedDate,
                    file: base64String
                }

                resolve(mmcoObj);
            };
            
            reader.readAsDataURL(file); // Read file as ArrayBuffer

        });
    }

    
    return (
     
        <div className='query'>
                <div className="card" style={{width: "100%"}}>
                    <div className="card-body">
                        <div className='border-1 border rounded-3'>
                            <div className="visual-input mb-2 border-1 border rounded-3">
                            {image ? 
                                <img id="query-chosen-image" src={imageurl} alt=""/>
                                : <i id= "query-placeholder-image" className="query-placeholder-image fa fa-image fa-3x"></i>
                            }
                            </div>
                            <div>
                                <audio id="audio-playback" className='m-2' controls src={audiourl} >
                                 
                                </audio>    
                            </div>
                            <div>
                                <div className='query-menu mt-1'>
                            { /*<button type="button" className='btn border border-secondary rounded-1 m-1' data-bs-toggle="modal" data-bs-target="#sketchinputModal"><span className="fa fa-paint-brush"></span></button>*/}
                                <button onClick={imageInput} type="button" className='btn border border-secondary rounded-1 m-1'><span className="fa fa-image"></span></button>
                                <button onClick={audioInput} type="button" className='btn border border-secondary rounded-1 m-1'><span className="fa fa-file-audio-o"></span></button>
                                <input type="file" onChange={imageUploaded} hidden id="image-input" accept=".png,.jpg,.jpeg"></input>  
                                <input type="file" onChange={audioUploaded} hidden id="audio-input" accept=".mp3,.wav"></input>  
                                <div className="dropdown m-1">
                                    <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="null">
                                        Clear
                                    </button>
                                    <ul className="dropdown-menu">
                                        <li><button onClick={clearImage} className="dropdown-item" >Image/Video</button></li>
                                        <li><button onClick={clearText} className="dropdown-item" >Text</button></li>
                                        <li><button onClick={clearAudio} className="dropdown-item" >Audio</button></li>     
                                        <li><button onClick={clearAll} className="dropdown-item" >All</button></li>
                                    </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <textarea className="form-control textarea mt-1" placeholder="Enter your text query..." id="query-textarea" value={text} rows="3" onChange={textChange}></textarea>
                            <div><i class="fa fa-chevron-down"onClick={() => setWsdUnfolded(!wsdUnfolded)}></i></div>   
                            {wsdUnfolded ? <WsdQuery ></WsdQuery>: ""}
                            <div><i class="fa fa-chevron-down"onClick={() => setFilterUnfolded(!filterUnfolded)}></i></div>
                            {filterUnfolded ? <Filter setFilter={props.setFilter}></Filter> :""}     
                     <button className="w-25 btn btn-primary mt-2 float-end"  onClick={ ()=> props.query(createMmcoQuery())}>Query</button>   
                    </div>
            </div>     
        </div>

       
    );

}

export default Query;