/**
 * Time helpers shared by the details and playback views.
 */

const pad = (value) => (value < 10 ? "0" + value : "" + value);

/** Formats a timestamp as local HH:MM:SS. */
export function formatClockTime(timestamp) {
  const date = new Date(timestamp);
  return pad(date.getHours()) + ":" + pad(date.getMinutes()) + ":" + pad(date.getSeconds());
}

/** Milliseconds since local midnight for the given date. */
export function timeOfDayMs(date) {
  return (date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds()) * 1000 + date.getMilliseconds();
}

/**
 * Begin of the "shot0" node and end of the last node, or "?" where unknown.
 */
export function getBeginEnd(data) {
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

/**
 * Time range of the "shot0" node, falling back to the first node; nulls if none.
 */
export function getShotTimeRange(data) {
  if (!data || !data.nodes || data.nodes.length === 0) return [null, null];

  const shot = data.nodes.find(node => node.name === "shot0" && node.timerange);
  if (shot) {
    return [shot.timerange.begin, shot.timerange.end];
  }
  if (data.nodes[0].timerange) {
    return [data.nodes[0].timerange.begin, data.nodes[0].timerange.end];
  }
  return [null, null];
}
