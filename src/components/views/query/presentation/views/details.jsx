import React, { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player";

import NodeTable from "./components/nodetable";

function Details2({ mmfgid }) {
  const [data, setData] = useState(null);
  const [played, setPlayed] = useState(0);
  const playerRef = useRef(null);

  useEffect(() => {
    if (mmfgid) {
      fetchDetails();
    } else {
      setData(null);
    }
  }, [mmfgid]);

  const fetchDetails = async () => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const response = await fetch(
        `http://127.0.0.1:8242/gmaf/gmafApi/gmaf/getmmfg/token1/${mmfgid}`,
        options
      );
      const detailData = await response.json();
      setData(detailData);
    } catch (error) {
      console.error("Error fetching details for ID:", mmfgid, error);
      setData(null);
    }
  };

  function formatTimestampToTime(timestamp) {
    const date = new Date(timestamp);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    // Padding single digits with leading zero
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds;
  }

  function getBeginEnde(data) {
    if (!data || !data.nodes || data.nodes.length === 0) return ["?", "?"];

    let begin = "?";
    let end = "?";

    if (data.nodes.length > 1) {
      try {
        for (const node of data.nodes) {
          if (node.name === "shot0") {
            begin = node.timerange.begin;
            break;
          }
        }
        end = data.nodes[data.nodes.length - 1].timerange.end;
      } catch (error) {
        console.error("Error processing time range:", error);
      }
    } else if (data.nodes[0].timerange) {
      begin = data.nodes[0].timerange.begin;
      end = data.nodes[0].timerange.end;
    }

    return [begin, end];
  }

  function showTimeRange(data) {
    const [begin, end] = getBeginEnde(data);
    return `${formatTimestampToTime(begin)} - ${formatTimestampToTime(end)}`;
  }

  const handleSeek = (second) => {
    console.log("Log to" + second);
    if (playerRef.current) {
      playerRef.current.seekTo(second, "seconds");
    }
  };

  const handleSeekToStart = () => {
    if (!data || !data.nodes || data.nodes.length === 0) return;

    const [begin] = getBeginEnde(data);
    const date = new Date(begin);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const theFinalSecond = hours * 60 * 60 + minutes * 60 + seconds;

    handleSeek(theFinalSecond);
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
                      onSeek={(e) => console.log("onSeek", e)}
                      controls
                      url={`http://localhost:8242/gmaf/gmafApi/gmaf/preview/token1/${mmfgid}`}
                      width="100%"
                      height="300px"
                    />
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
