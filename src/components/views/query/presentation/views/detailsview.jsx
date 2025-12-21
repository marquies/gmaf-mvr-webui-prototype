import React, { useState, useRef } from "react";
import AssetCard from "./components/assetCard";
import Carousel from "react-bootstrap/Carousel";

function DetailsView(props) {
  const [index] = useState(0); // Current index in the carousel
  const [page] = useState(1); // Current page
  const [cmmcos] = useState(props.cmmcos); // Current items on the page

  const isInitialized = useRef(false);


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
          >
            {cmmcos.map((cmmco, index) => (
              <Carousel.Item key={index + "2"}>
                <AssetCard
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
