import React, { useState, useRef } from "react";
import Playback from "./components/playback";
import Carousel from "react-bootstrap/Carousel";
import GMAFAdapter from "../../../../../js/GMAFAdapter";

function DetailsView(props) {
  const [index, setIndex] = useState(0); // Current index in the carousel
  const [page, setPage] = useState(1); // Current page
  const [cmmcos, setCmmcos] = useState(props.cmmcos); // Current items on the page
  const [cmmcoMap, setCmmcoMap] = useState({ 1: props.cmmcos }); // Cache for fetched pages
  const lastIndex = useRef(0);
  const lastOverallIndex = useRef(0); // Last selected index in the carousel
  const overallIndex = useRef(0);
  const isInitialized = useRef(false);

  const handleSelect = async (selectedIndex) => {
    var backward = lastIndex.current == 0 && selectedIndex == cmmcos.length - 1;
    var countdown =
      lastIndex.current > selectedIndex &&
      lastIndex.current - selectedIndex == 1;

    //Backward navigation
    if (backward) {
      if (page == 1) {
        console.log("negative break");
        return;
      }

      var currentPage = page;

      var newPage = currentPage - 1;

      setPage(newPage);
      setCmmcos(cmmcoMap[newPage]);
      setIndex(7);
      lastIndex.current = 7;
      return;
    }

    // Calculate the overall index
    const currentOverallIndex = (page - 1) * 8 + selectedIndex;
    overallIndex.current = currentOverallIndex;

    // Check if the overall index matches the last item
    if (lastOverallIndex.current === props.numOfAllResults - 1) {
      // Restart from the beginning
      setPage(1);
      setCmmcos(props.cmmcos);
      setIndex(0);
      overallIndex.current = 0;
      lastIndex.current = 0;
      lastOverallIndex.current = 0;
      //justNegative.current = false;
      return;
    }

    lastOverallIndex.current = overallIndex.current;

    // Check if we need to load the next page
    if (lastIndex.current + 1 === cmmcos.length && !countdown) {
      let nextPage = page + 1;

      // Fetch or use cached data for the next page
      if (!cmmcoMap[nextPage]) {
        const gmaf = await GMAFAdapter.getInstance();
        const results = await gmaf.getPage(nextPage, 8, props.updateStatus);

        setCmmcoMap((prevMap) => ({
          ...prevMap,
          [nextPage]: results.results,
        }));

        setCmmcos(results.results); // Update current page items
        setPage(nextPage); // Move to the next page
        setIndex(0); // Reset carousel index to the first item
        lastIndex.current = 0;
      } else {
        // Use cached page
        setCmmcos(cmmcoMap[nextPage]);
        setPage(nextPage);
        setIndex(0);
        lastIndex.current = 0;
      }
    } else {
      //Normal case: Move within the current page
      setIndex(selectedIndex);
      lastIndex.current = selectedIndex;
    }
  };

  function canRender() {
    isInitialized.current = true;

    if (Array.isArray(cmmcos) && cmmcos.length === 0) {
      return false;
    }

    if (cmmcos === false || typeof cmmcos != "object") {
      return false;
    }

    return true;
  }

  return (
    <div>
      {cmmcos.length > 0 ? (
        <h2 className="ms-3">
          {page * 8 - 8 + index + 1} / {props.numOfAllResults}
        </h2>
      ) : (
        ""
      )}
      <div className="detailsview-container ms-2">
        {canRender() ? (
          <Carousel
            key={cmmcos.length}
            interval={null}
            activeIndex={index}
            onSelect={handleSelect}
          >
            {cmmcos.map((cmmco, index) => (
              <Carousel.Item key={index + "2"}>
                <Playback
                  key={index}
                  cmmco={cmmco}
                  id={cmmco.md.id}
                  view={"details"}
                />
              </Carousel.Item>
            ))}
          </Carousel>
        ) : !isInitialized.current ? (
          <h3>No Elements found for the query</h3>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default DetailsView;
