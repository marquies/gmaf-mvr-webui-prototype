import React, { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player";
import config from "../../../../../config/config";
import { formatClockTime, getBeginEnd } from "../../../../../js/time";

import NodeTable from "./components/nodetable";
import PdPlayerDummy from "./components/pdplayerdummy";

function Details2({ mmfgid }) {
  const [data, setData] = useState(null);
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

  function showTimeRange(data) {
    const [begin, end] = getBeginEnd(data);
    return `${formatClockTime(begin)} - ${formatClockTime(end)}`;
  }

  const handleSeek = (second) => {
    if (playerRef.current) {
      playerRef.current.seekTo(second, "seconds");
    }
  };

  const handleSeekToStart = () => {
    if (!data || !data.nodes || data.nodes.length === 0) return;

    const [begin] = getBeginEnd(data);
    const date = new Date(begin);
    handleSeek(date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds());
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
          <div className="card-header">
            <h5 className="card-title">
              Details for {data.generalMetadata.fileName}
            </h5>
            <p className="small text-muted mb-0">MMFGID: {mmfgid}</p>
          </div>
          <div
            className="card-body d-flex flex-column"
            style={{ height: "calc(100% - 48px)", padding: 0, overflow: "hidden" }}
          >
            {data.nodes && data.nodes.length > 0 && (
              <>
                <div className="px-3 pt-3">
                  <p className="card-text">
                    {data.nodes[0].name}: {showTimeRange(data)}
                  </p>
                  <div className="mb-3">
                    <ReactPlayer
                      ref={playerRef}
                      controls
                      url={`${config.baseUrl}/gmaf/preview/token1/${mmfgid}`}
                      width="100%"
                      height="300px"
                    />
                    <PdPlayerDummy mmfgid={mmfgid} />
                  </div>
                </div>
                <div className="px-3 d-flex flex-column" style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
                  <div className="d-flex align-items-center mb-3">
                    <button
                      className="btn btn-primary"
                      onClick={handleSeekToStart}
                    >
                      Seek to start
                    </button>
                  </div>
                  <div className="overflow-auto mb-3" style={{ flex: 1, minHeight: 0 }}>
                    <NodeTable data={data} seekTo={handleSeek} />
                  </div>
                  <div className="overflow-auto" style={{ flex: 1, minHeight: 0 }}>
                    <label>Raw Data:</label>
                    <textarea
                      className="form-control"
                      style={{ height: "200px" }}
                      readOnly={true}
                      value={JSON.stringify(data, null, 2)}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Details2;
