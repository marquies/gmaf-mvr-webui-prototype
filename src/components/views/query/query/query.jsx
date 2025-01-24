import React, { useEffect, useState} from 'react';
import Filter from './filter';
import WsdQuery from './wsdquery';




function Query(props) {
    
    const [text, setText] = useState(""); 
    const [image, setImage] = useState(null);  
    const [imageurl, setImageurl] = useState("");
    const [audio, setAudio] = useState(null);
    const [audiourl, setAudiourl] = useState("");
    const [wsdKey, setWsdKey] = useState(Math.random());
    const [wsd, setWsd] = useState(null);
    const [wsdUnfolded, setWsdUnfolded] = useState(null);
    const [filterUnfolded, setFilterUnfolded] = useState(true); //Show by default
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
        document.getElementById('image-input').value="";
    }

    function clearText() {
        setText("");
    }

    function clearAudio() {
       setAudio(null);
       document.getElementById('audio-input').value="";
    }
    function clearGolf() {
        setWsdKey(Math.random());
    }

    function clearAll() {
        clearText();
        clearImage();
        clearAudio();
        setWsdKey(Math.random());
    }
    
   async function createMmcoQuery() {

        var imageObj=  image? await fileInputToMmmcoObject(image):null;
        
        var audiObj = audio? await fileInputToMmmcoObject(audio):null;
        var images= imageObj?[imageObj]:[];
        var audios = audiObj?[audiObj]:[];

        if(text!=""){

            if(!isValidCommaSeparatedKeywords(text)){

                alert("Please enter a comma separated list of keywords");
                return false;
            }
        }

        const mmco={
            images: images,
            audios: audios,
        }
        const cmmcoQuery = {
            srd:{},
            pd:{},
            mmco:mmco,
            md:{keywords: text},
            wsd:{}
        }

        return cmmcoQuery;
    }

    function isValidCommaSeparatedKeywords(str) {

        //Here further methods can be added
        return true;
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

     const handleQueryClicked = () => {
            const query = createMmcoQuery(); // Generate the query
            props.setCmmcoQuery(query); // Update the state in the parent
      };


    
    return (
     
        <div className='query'>
                <div className="card border-primary shadow" style={{width: "100%"}}>
                    <div className="card-header bg-primary text-white">
                        <h5 className="card-title mb-0">Query Menu</h5>
                    </div>
                    <div className="card-body">
                        <div className='border-1 border border-dark rounded-3 p-3'>
                            <h5>Keywords</h5>
                            <p className="text-muted small mb-2">Enter keywords separated by commas to search for specific content (e.g., "nature, mountains, sunset")</p>
                            <textarea className="form-control textarea mt-1" placeholder="Enter your comma seperated keywords here..." spellCheck="false" id="query-textarea" value={text} rows="3" onChange={textChange}></textarea>
                            <h5>Examples</h5>
                            <p className="text-muted small mb-2">Upload image or audio files as examples to find similar content in the database</p>
                            <div className="d-flex align-items-center gap-3 mb-3">
                                <div>
                                    <h6 className="mb-2">Upload</h6>
                                    <div className="btn-group" role="group" aria-label="Upload options">
                                        <button onClick={imageInput} type="button" className="btn btn-outline-primary" title="Upload Image">
                                            <span className="fa fa-image"></span>
                                            <span className="ms-2">Image</span>
                                        </button>
                                        <button onClick={audioInput} type="button" className="btn btn-outline-primary" title="Upload Audio">
                                            <span className="fa fa-file-audio-o"></span>
                                            <span className="ms-2">Audio</span>
                                        </button>
                                    </div>
                                    <input type="file" onChange={imageUploaded} hidden id="image-input" accept=".png,.jpg,.jpeg"></input>  
                                    <input type="file" onChange={audioUploaded} hidden id="audio-input" accept=".mp3,.wav"></input>  
                                </div>
                                <div className="ms-3">
                                    <h6 className="mb-2">Actions</h6>
                                    <div className="dropdown">
                                        <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="null">
                                            Clear
                                        </button>
                                        <ul className="dropdown-menu">
                                            <li><button onClick={clearImage} className="dropdown-item">Image</button></li>
                                            <li><button onClick={clearText} className="dropdown-item">Text</button></li>
                                            <li><button onClick={clearAudio} className="dropdown-item">Audio</button></li>  
                                            <li><button onClick={clearGolf} className="dropdown-item">World Specific Data</button></li>   
                                            <li><button onClick={clearAll} className="dropdown-item">All</button></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <h6>Preview</h6>
                            <div className="border-1 border rounded-3">
                                
                            <div className="visual-input mb-2">
                            {image ? 
                                <img id="query-chosen-image" src={imageurl} alt=""/>
                                : <i id= "query-placeholder-image" className="query-placeholder-image fa fa-image fa-3x"></i>
                            }
                            </div>
                            <div>
                                <audio id="audio-playback" className='m-2' controls src={audiourl} >
                                 
                                </audio>    
                            </div>
                            </div>
                        </div>
                        
                        <div className="card border-dark mt-3 mb-2">
                            <div className="card-header d-flex align-items-center bg-light">
                                <i className="fa fa-chevron-down fsize me-2" onClick={() => setWsdUnfolded(!wsdUnfolded)}></i>
                                <div>
                                    <span>World Specific Data</span>
                                    <p className="text-muted small mb-0 mt-1">Define domain-specific search criteria for your query</p>
                                </div>
                            </div>
                            <div className="card-body p-2">
                                {wsdUnfolded ? <WsdQuery key={wsdKey}></WsdQuery>: ""}
                            </div>
                        </div>

                        <div className="card border-dark mb-2">
                            <div className="card-header d-flex align-items-center bg-light">
                                <i className="fa fa-chevron-down fsize me-2" onClick={() => setFilterUnfolded(!filterUnfolded)}></i>
                                <div>
                                    <span>Filter</span>
                                    <p className="text-muted small mb-0 mt-1">Refine your search results by applying specific filters</p>
                                </div>
                            </div>
                            <div className="card-body p-2">
                                {filterUnfolded ? <Filter setFilter={props.setFilter}></Filter> :""}
                            </div>
                        </div>
                        
                        <button className="w-25 btn btn-primary mt-2 float-end" onClick={handleQueryClicked}>Query</button>
                    </div>
            </div>     
        </div>

       
    );

}

export default Query;