import React, { useState, useEffect, useRef } from 'react';


function NodeTable({ data, seekTo }) {
    const [filter, setFilter] = useState("");
  
    function formatTimestampToTime(timestamp) {
      var date = new Date(timestamp);
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var seconds = date.getSeconds();
  
      // Padding single digits with leading zero
      hours = hours < 10 ? '0' + hours : hours;
      minutes = minutes < 10 ? '0' + minutes : minutes;
      seconds = seconds < 10 ? '0' + seconds : seconds;
  
      return hours + ':' + minutes + ':' + seconds;
    }
    function getTimestampAsSeconds(timestamp) {
      var date = new Date(timestamp);
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var seconds = date.getSeconds();
      
      var timestampInSeconds = hours * 60 * 60 + minutes * 60 + seconds;
      console.log("Timestamp as seconds: " + timestampInSeconds); 
      return timestampInSeconds;
    }
    function filterset(value) {  
      console.log("State " + value.target.value);
      setFilter(value.target.value.toLowerCase());
    }
    return (
      <>
      <input type="text" id="myInput" onChange={filterset} placeholder="Search for names.." title="Type in a name" />
      <table>
        <thead>
          <tr>
            <th>Node</th>
            <th>Begin</th>
            <th>End</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.nodes.map((node, i) => (
            <>
              <tr key={i}>
                <td>{node.name}</td>
                {node.timerange == undefined ? (
                  <>
                  <td></td>
                  <td></td>
                  </>
                ) : (
                  <>
                <td>{formatTimestampToTime(node.timerange.begin)}</td>
                <td>{formatTimestampToTime(node.timerange.end)}</td>
                  </>
                )}
              </tr>
            {node.childNodes.map((subnode, i) => (
              <>
                {filter == "" || subnode.name.toLowerCase().includes(filter) ? (
                  <tr key={i}>
                    <td>-{subnode.name}</td>
                    {subnode.timerange == undefined ? (
                      <>
                      <td></td>
                      <td></td>
                      </>
                    ) : (
                      <>
                      <td>{formatTimestampToTime(subnode.timerange.begin)}</td>
                      <td>{formatTimestampToTime(subnode.timerange.end)}</td>
                      </>
                    )}
                    <td><button onClick={() => seekTo(getTimestampAsSeconds(subnode.timerange.begin))}>Seek to start</button></td>
                  </tr>
                ):(
                <></>
                )}
              </>
            ))}
            </>
          ))}
        </tbody>
      </table>
      </>
    );
      
  }
export default NodeTable;  