import React, { useEffect, useState } from "react";
import WsdQuery from "./wsdquery";
import { WithContext as ReactTags } from "react-tag-input";
import "./ReactTags.css";

const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

function Query(props) {
  const [text, setText] = useState("");
  const [showMixedModeWarning, setShowMixedModeWarning] = useState(false);
  const [tags, setTags] = useState([]);
  const [image, setImage] = useState(null);
  const [imageurl, setImageurl] = useState("");
  const [audio, setAudio] = useState(null);
  const [audiourl, setAudiourl] = useState("");
  const [wsdKey, setWsdKey] = useState(Math.random());
  const [wsdUnfolded, setWsdUnfolded] = useState(null);

  // The styled buttons forward clicks to the hidden file inputs
  function imageInput() {
    document.getElementById("image-input").click();
  }

  function audioInput() {
    document.getElementById("audio-input").click();
  }

  function imageUploaded(event) {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
    }
  }

  //Update Preview
  useEffect(() => {
    var url = image ? URL.createObjectURL(image) : "";
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
    var url = audio ? URL.createObjectURL(audio) : "";
    setAudiourl(url);
  }, [audio]);

  function clearImage() {
    setImage(null);
    document.getElementById("image-input").value = "";
  }

  function clearText() {
    setText("");
    setTags([]);
  }

  function clearAudio() {
    setAudio(null);
    document.getElementById("audio-input").value = "";
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
    // Query by example: run a similarity search on the first example instead of a keyword query
    if (props.queryExamples && props.queryExamples.length > 0) {
      if (props.similarity) {
        props.similarity(props.queryExamples[0].id);
      }
      return null;
    }

    const imageObj = image ? await fileInputToMmmcoObject(image) : null;
    const audioObj = audio ? await fileInputToMmmcoObject(audio) : null;

    return {
      srd: {},
      pd: {},
      mmco: {
        images: imageObj ? [imageObj] : [],
        audios: audioObj ? [audioObj] : [],
      },
      md: { keywords: text },
      wsd: {},
    };
  }

  function fileInputToMmmcoObject(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target.result.split(",")[1];

        resolve({
          filename: file.name,
          filesize: file.size,
          filetype: file.type,
          lastmodiied: file.lastModifiedDate,
          file: base64String,
        });
      };

      reader.readAsDataURL(file);
    });
  }

  function handleDelete(i) {
    setTags(tags.filter((tag, index) => index !== i));
    updateText(tags.filter((tag, index) => index !== i));
  }

  function handleAddition(tag) {
    setTags([...tags, tag]);
    updateText([...tags, tag]);
  }

  function handleDrag(tag, currPos, newPos) {
    const newTags = tags.slice();
    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);
    setTags(newTags);
    updateText(newTags);
  }

  function updateText(newTags) {
    const newText = newTags.map((tag) => tag.text).join(", ");
    setText(newText);
  }

  const handleQueryClicked = async () => {
    // Check if both keywords and examples are provided
    const hasKeywords = text.trim() !== "" || tags.length > 0;
    const hasExamples = props.queryExamples && props.queryExamples.length > 0;
    
    if (hasKeywords && hasExamples) {
      setShowMixedModeWarning(true);
      return;
    }
    
    setShowMixedModeWarning(false);
    
    const queryResult = await createMmcoQuery();
    // null means a similarity search was started instead
    if (queryResult !== null) {
      props.setCmmcoQuery(Promise.resolve(queryResult));
    }
  };

  return (
    <div className="query">
      <div className="card border-primary shadow" style={{ width: "100%" }}>
        <div className="card-header bg-primary text-white">
          <h5 className="card-title mb-0">Query Menu</h5>
        </div>
        <div className="card-body">
          <div className="border-1 border border-dark rounded-3 p-3">
            <div className="keywords-container">
              <h5>Keywords</h5>
              <p className="text-muted small mb-2">
                Enter keywords separated by commas to search for specific content
                (e.g., "nature, mountains, sunset")
              </p>
              <div className="keywords-input-container">
                <ReactTags
                  tags={tags}
                  delimiters={delimiters}
                  handleDelete={handleDelete}
                  handleAddition={handleAddition}
                  handleDrag={handleDrag}
                  inputFieldPosition="top"
                  autocomplete
                  placeholder="Type and press enter or comma to add keywords"
                  classNames={{
                    tags: "ReactTags__tags",
                    tagInput: "ReactTags__tagInput form-control",
                    tagInputField: "ReactTags__tagInputField",
                    selected: "ReactTags__selected",
                    tag: "ReactTags__tag btn btn-primary btn-sm",
                    remove: "ReactTags__remove",
                  }}
                />
              </div>
            </div>
            <h5>Examples</h5>
            <p className="text-muted small mb-2">
              Upload image or audio files as examples to find similar content in
              the database
            </p>
            
            {props.queryExamples && props.queryExamples.length > 0 && (
              <div className="mb-3">
                <h6 className="mb-2">Selected Examples</h6>
                <div className="d-flex flex-wrap gap-2">
                  {props.queryExamples.map((example) => (
                    <span 
                      key={example.id} 
                      className="badge bg-primary d-flex align-items-center gap-2"
                      style={{ fontSize: '0.9rem', padding: '0.5rem 0.75rem' }}
                    >
                      <i className="fa fa-file"></i>
                      <span>{example.generalMetadata?.fileName || 'Unknown'}</span>
                      <i 
                        className="fa fa-times" 
                        style={{ cursor: 'pointer' }}
                        onClick={() => props.onRemoveExample(example.id)}
                      ></i>
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="d-flex align-items-center gap-3 mb-3">
              <div>
                <h6 className="mb-2">Upload</h6>
                <div
                  className="btn-group"
                  role="group"
                  aria-label="Upload options"
                >
                  <button
                    onClick={imageInput}
                    type="button"
                    className="btn btn-outline-primary"
                    title="Upload Image"
                  >
                    <span className="fa fa-image"></span>
                    <span className="ms-2">Image</span>
                  </button>
                  <button
                    onClick={audioInput}
                    type="button"
                    className="btn btn-outline-primary"
                    title="Upload Audio"
                  >
                    <span className="fa fa-file-audio-o"></span>
                    <span className="ms-2">Audio</span>
                  </button>
                </div>
                <input
                  type="file"
                  onChange={imageUploaded}
                  hidden
                  id="image-input"
                  accept=".png,.jpg,.jpeg"
                ></input>
                <input
                  type="file"
                  onChange={audioUploaded}
                  hidden
                  id="audio-input"
                  accept=".mp3,.wav"
                ></input>
              </div>
              <div className="ms-3">
                <h6 className="mb-2">Actions</h6>
                <div className="dropdown">
                  <button
                    className="btn btn-outline-secondary dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Clear Examples
                  </button>
                  <ul className="dropdown-menu">
                    <li>
                      <button onClick={clearImage} className="dropdown-item">
                        Image
                      </button>
                    </li>
                    <li>
                      <button onClick={clearText} className="dropdown-item">
                        Text
                      </button>
                    </li>
                    <li>
                      <button onClick={clearAudio} className="dropdown-item">
                        Audio
                      </button>
                    </li>
                    <li>
                      <button onClick={clearGolf} className="dropdown-item">
                        World Specific Data
                      </button>
                    </li>
                    <li>
                      <button onClick={clearAll} className="dropdown-item">
                        All
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <h6>Preview</h6>
            <div className="border-1 border rounded-3">
              <div className="visual-input mb-2">
                {image ? (
                  <img id="query-chosen-image" src={imageurl} alt="" />
                ) : (
                  <i
                    id="query-placeholder-image"
                    className="query-placeholder-image fa fa-image fa-3x"
                  ></i>
                )}
              </div>
              <div>
                <audio
                  id="audio-playback"
                  className="m-2"
                  controls
                  src={audiourl}
                ></audio>
              </div>
            </div>
          </div>

          <div className="card border-dark mt-3 mb-2">
            <div className="card-header d-flex align-items-center bg-light">
              <i
                className="fa fa-chevron-down fsize me-2"
                onClick={() => setWsdUnfolded(!wsdUnfolded)}
              ></i>
              <div>
                <span>World Specific Data</span>
                <p className="text-muted small mb-0 mt-1">
                  Define domain-specific search criteria for your query
                </p>
              </div>
            </div>
            <div className="card-body p-2">
              {wsdUnfolded ? <WsdQuery key={wsdKey}></WsdQuery> : ""}
            </div>
          </div>

          {showMixedModeWarning && (
            <div className="alert alert-warning mt-3" role="alert">
              <i className="fa fa-exclamation-triangle me-2"></i>
              <strong>Warning:</strong> Please use either keywords OR query examples, not both. 
              Clear one to proceed with the other.
            </div>
          )}

          <button
            className="w-25 btn btn-primary mt-2 float-end"
            onClick={handleQueryClicked}
          >
            Query
          </button>
        </div>
      </div>
    </div>
  );
}

export default Query;
