import React, { useState, useEffect, useRef } from 'react';
import { usePlayback } from './playback/PlaybackContext';


function NodeTable({ data, seekTo }) {
    const [filter, setFilter] = useState("");
    const { globalStartTime } = usePlayback();
  
    // Get the global start time from playback context
    function getGlobalStartTime() {
      return globalStartTime || 0;
    }
  
    function formatTimestampToTime(timestamp) {
      console.log("Formatting timestamp:", timestamp);
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
    
    function getRelativeOffsetMs(timestamp) {
      const globalStart = getGlobalStartTime();
      
      // Extract time-of-day only (ignore date components)
      const getTimeOfDayMs = (ts) => {
        const date = new Date(ts);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        const milliseconds = date.getMilliseconds();
        return (hours * 3600 + minutes * 60 + seconds) * 1000 + milliseconds;
      };
      
      const globalStartTimeOfDay = getTimeOfDayMs(globalStart) - ( 60 * 60 * 1000);
      const targetTimeOfDay = getTimeOfDayMs(timestamp);
      
      // Calculate offset using only time-of-day
      const offset = targetTimeOfDay - globalStartTimeOfDay;
      
      console.log("=== Seek Calculation ===");
      console.log("Global start timestamp:", globalStart, "(" + new Date(globalStart).toLocaleTimeString() + ")");
      console.log("Global start time-of-day (ms):", globalStartTimeOfDay);
      console.log("Target timestamp:", timestamp, "(" + new Date(timestamp).toLocaleTimeString() + ")");
      console.log("Target time-of-day (ms):", targetTimeOfDay);
      console.log("Calculated offset (ms):", offset);
      console.log("Offset in seconds:", offset / 1000);
      console.log("=======================");
      
      return offset;
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
                <td><button onClick={() => seekTo(getRelativeOffsetMs(node.timerange.begin))}>Seek to start</button></td>
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
                    <td><button onClick={() => seekTo(getRelativeOffsetMs(subnode.timerange.begin))}>Seek to start</button></td>
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