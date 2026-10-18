import React, { useState, useEffect, useRef } from "react";
import config from "../../../../../config/config";

import NodeTable from "./components/nodetable";
import PlaybackSelector from "./components/playback/PlaybackSelector";
import { Playback } from "./components/playback/PlaybackContext";

function AlternativeDetails({ mmfgid }) {
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("player");
  const playerRef = useRef(null);

  useEffect(() => {
    if (!mmfgid) {
      setData(null);
      return;
    }
    const fetchDetails = async () => {
      try {
        const response = await fetch(`${config.baseUrl}/gmaf/getmmfg/token1/${mmfgid}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        setData(await response.json());
      } catch (error) {
        console.error("Error fetching details for ID:", mmfgid, error);
        setData(null);
      }
    };
    fetchDetails();
  }, [mmfgid]);

  const handleSeek = (second) => {
    if (playerRef.current) {
      playerRef.current.seekTo(second, "seconds");
    }
  };

  return (
    <div className="card border-primary shadow" style={{ height: "100%" }}>
      {!data ? (
        <div
          className="card-body d-flex align-items-center justify-content-center"
          style={{ height: "100%" }}
        >
          <p className="card-text text-muted">
            {mmfgid ? "Loading..." : "Select an item to view details"}
          </p>
        </div>
      ) : (
        <>
          <div className="card-header bg-primary text-white">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">
                {data.generalMetadata.fileName}
              </h5>
              <span className="badge bg-light text-primary">Power View</span>
            </div>
            <p className="small text-white-50 mb-0">MMFGID: {mmfgid}</p>
          </div>
          <div
            className="card-body d-flex flex-column"
            style={{ height: "calc(100% - 48px)", padding: 0, overflow: "hidden" }}
          >
            {data.nodes && data.nodes.length > 0 && (
              <>
                <ul className="nav nav-tabs nav-fill">
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeTab === "player" ? "active" : ""}`}
                      onClick={() => setActiveTab("player")}
                    >
                      <i className="fa fa-play-circle me-2"></i>Media Player
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeTab === "nodes" ? "active" : ""}`}
                      onClick={() => setActiveTab("nodes")}
                    >
                      <i className="fa fa-sitemap me-2"></i>Node Structure
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeTab === "raw" ? "active" : ""}`}
                      onClick={() => setActiveTab("raw")}
                    >
                      <i className="fa fa-code me-2"></i>Raw Data
                    </button>
                  </li>
                </ul>
                
                <div className="tab-content p-3" style={{ flex: 1, overflow: "auto" }}>
                  {activeTab === "player" && (
                    <div className="tab-pane fade show active">
                      <PlaybackSelector 
                        data={data} 
                        mmfgid={mmfgid} 
                        playerRef={playerRef} 
                        handleSeek={handleSeek} 
                      />
                    </div>
                  )}
                  
                  {activeTab === "nodes" && (
                    <div className="tab-pane fade show active">
                      <Playback>
                        <div className="card">
                          <div className="card-header bg-light">
                            <h6 className="mb-0">Node Structure</h6>
                          </div>
                          <div className="card-body">
                            <NodeTable data={data} seekTo={handleSeek} />
                          </div>
                        </div>
                      </Playback>
                    </div>
                  )}
                  
                  {activeTab === "raw" && (
                    <div className="tab-pane fade show active">
                      <div className="card">
                        <div className="card-header bg-light">
                          <h6 className="mb-0">Raw JSON Data</h6>
                        </div>
                        <div className="card-body">
                          <textarea
                            className="form-control"
                            style={{ height: "400px", fontFamily: "monospace" }}
                            readOnly={true}
                            value={JSON.stringify(data, null, 2)}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default AlternativeDetails;
