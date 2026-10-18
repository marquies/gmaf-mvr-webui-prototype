import React, { useState } from 'react';
import { usePlayback } from './playback/PlaybackContext';
import { formatClockTime, timeOfDayMs } from '../../../../../../js/time';

function NodeTable({ data, seekTo }) {
    const [filter, setFilter] = useState("");
    const { globalStartTime } = usePlayback();

    // Offset of the timestamp from the global playback start, comparing time-of-day only
    function getRelativeOffsetMs(timestamp) {
      const globalStartTimeOfDay = timeOfDayMs(new Date(globalStartTime || 0)) - (60 * 60 * 1000);
      return timeOfDayMs(new Date(timestamp)) - globalStartTimeOfDay;
    }

    function filterset(value) {
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
            <React.Fragment key={i}>
              <tr>
                <td>{node.name}</td>
                {node.timerange === undefined ? (
                  <>
                    <td></td>
                    <td></td>
                  </>
                ) : (
                  <>
                    <td>{formatClockTime(node.timerange.begin)}</td>
                    <td>{formatClockTime(node.timerange.end)}</td>
                    <td><button onClick={() => seekTo(getRelativeOffsetMs(node.timerange.begin))}>Seek to start</button></td>
                  </>
                )}
              </tr>
              {node.childNodes
                .filter(subnode => filter === "" || subnode.name.toLowerCase().includes(filter))
                .map((subnode, j) => (
                  <tr key={j}>
                    <td>-{subnode.name}</td>
                    {subnode.timerange === undefined ? (
                      <>
                        <td></td>
                        <td></td>
                      </>
                    ) : (
                      <>
                        <td>{formatClockTime(subnode.timerange.begin)}</td>
                        <td>{formatClockTime(subnode.timerange.end)}</td>
                      </>
                    )}
                    <td><button onClick={() => seekTo(getRelativeOffsetMs(subnode.timerange.begin))}>Seek to start</button></td>
                  </tr>
                ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      </>
    );
}

export default NodeTable;
