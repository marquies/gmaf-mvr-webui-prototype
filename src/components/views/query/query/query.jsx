import React, { useEffect, useState } from "react";
import Filter from "./filter";
import WsdQuery from "./wsdquery";
import { WithContext as ReactTags } from "react-tag-input";
import "./ReactTags.css";
import { useQueryHandler } from './QueryHandler';
import { keyboard } from "@testing-library/user-event/dist/keyboard";

const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

function Query(props) {
  const [text, setText] = useState("");
  const [isValidKeywords, setIsValidKeywords] = useState(true);
  const [tags, setTags] = useState([]);
  const [image, setImage] = useState(null);
  const [imageurl, setImageurl] = useState("");
  const [audio, setAudio] = useState(null);
  const [audiourl, setAudiourl] = useState("");
  const [wsdKey, setWsdKey] = useState(Math.random());
  const [wsd, setWsd] = useState(null);
  const [wsdUnfolded, setWsdUnfolded] = useState(null);
  const [filterUnfolded, setFilterUnfolded] = useState(true); //Show by default
  const [pluginSelected, setPluginSelected] = useState(0);
  const [filter, setFilter] = useState({});
  const [allResults, setAllResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);

  const { isLoading, fetchIds } = useQueryHandler(props.setCmmcoQuery);

  useEffect(() => {
    if (allResults.length > 0) {
      applyClientFilter();
    }
  }, [filter, allResults]);

  const applyClientFilter = () => {
    let results = [...allResults];
    
    if (filter.name) {
      results = results.filter(result => 
        result.generalMetadata?.fileName?.toLowerCase().includes(filter.name.toLowerCase())
      );
    }

    if (filter.fromDate) {
      results = results.filter(result => {
        const resultDate = new Date(result.generalMetadata?.creationDate);
        return resultDate >= filter.fromDate;
      });
    }

    if (filter.toDate) {
      results = results.filter(result => {
        const resultDate = new Date(result.generalMetadata?.creationDate);
        return resultDate <= filter.toDate;
      });
    }

    if (filter.type) {
      results = results.filter(result => 
        result.generalMetadata?.type === filter.type
      );
    }

    setFilteredResults(results);
    props.onResultsChange(results);
  };

  const handleSearch = async () => {
    try {
      // Fetch all results without filtering
      const results = await fetchIds({
        query: text,
        wsd: wsd,
        plugin: pluginSelected,
        filter: {} // Empty filter since we're doing client-side filtering
      });
      setAllResults(results);
      props.setCmmcoQuery(results); // Update the results immediately
      // Initial filtering will be applied through useEffect
    } catch (error) {
      console.error('Error performing search:', error);
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    if (allResults.length > 0) {
      let filtered = [...allResults];
      
      if (newFilter.name) {
        filtered = filtered.filter(result => 
          result.generalMetadata?.fileName?.toLowerCase().includes(newFilter.name.toLowerCase())
        );
      }

      if (newFilter.fromDate) {
        filtered = filtered.filter(result => {
          const resultDate = new Date(result.generalMetadata?.creationDate);
          return resultDate >= newFilter.fromDate;
        });
      }

      if (newFilter.toDate) {
        filtered = filtered.filter(result => {
          const resultDate = new Date(result.generalMetadata?.creationDate);
          return resultDate <= newFilter.toDate;
        });
      }

      if (newFilter.type) {
        filtered = filtered.filter(result => 
          result.generalMetadata?.type === newFilter.type
        );
      }

      props.setCmmcoQuery(filtered); // Update the filtered results
    }
  };

  function textChange(event) {
    const newText = event.target.value;
    setText(newText);
    // Check if text is not empty and doesn't contain commas
    if (newText.trim() !== "" && !newText.includes(",")) {
      setIsValidKeywords(false);
    } else {
      setIsValidKeywords(true);
    }
  }

  function imageInput() {
    //for styled buttons trigger hiddenfield here
    document.getElementById("image-input").click();
  }

  function audioInput() {
    //for styled buttons trigger hiddenfield here
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
    var imageObj = image ? await fileInputToMmmcoObject(image) : null;

    var audiObj = audio ? await fileInputToMmmcoObject(audio) : null;
    var images = imageObj ? [imageObj] : [];
    var audios = audiObj ? [audiObj] : [];

    if (text != "") {
      if (!isValidCommaSeparatedKeywords(text)) {
        alert("Please enter a comma separated list of keywords");
        return false;
      }
    }
    // Strip spaces from keywords
    const keywords = text.split(",").map((keyword) => keyword.trim());

    const mmco = {
      images: images,
      audios: audios,
    };
    const cmmcoQuery = {
      srd: {},
      pd: {},
      mmco: mmco,
      md: { keywords: text },
      wsd: {},
    };

    return cmmcoQuery;
  }

  function isValidCommaSeparatedKeywords(str) {
    //Here further methods can be added
    return true;
  }

  function fileInputToMmmcoObject(file) {
    return new Promise((resolve) => {
      // Read the file as an ArrayBuffer
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target.result.split(",")[1];

        var mmcoObj = {
          filename: file.name,
          filesize: file.size,
          filetype: file.type,
          lastmodiied: file.lastModifiedDate,
          file: base64String,
        };

        resolve(mmcoObj);
      };

      reader.readAsDataURL(file); // Read file as ArrayBuffer
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

  const handleQueryClicked = () => {
    // Create a promise that will resolve with the query
    const queryPromise = createMmcoQuery();
    props.setCmmcoQuery(queryPromise);
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
                {!isValidKeywords && (
                  <div className="invalid-feedback d-block mt-2">
                    Please use commas to separate multiple keywords (e.g., "nature, mountains")
                  </div>
                )}
              </div>
            </div>
            <h5>Examples</h5>
            <p className="text-muted small mb-2">
              Upload image or audio files as examples to find similar content in
              the database
            </p>
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
                    aria-expanded="null"
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

          <button
            className={`w-25 btn btn-primary mt-2 float-end ${isLoading ? 'disabled' : ''}`}
            onClick={handleQueryClicked}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Querying...
              </>
            ) : (
              'Query'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Query;
