import React, {useState} from 'react';
import Playback from './components/playback';
import Carousel from 'react-bootstrap/Carousel';


function DetailsView(props){

    const [index, setIndex] = useState(0);
    const {cmmcos} = props;

    const handleSelect = (selectedIndex) => {
        console.log("Selected index: ", selectedIndex);
      setIndex(selectedIndex);
    };

function canRender(){

    if (Array.isArray(cmmcos) && cmmcos.length === 0) {
        return false;
    }

    if(cmmcos === false || typeof(cmmcos) != 'object'){
        return false;
    }

    return true;
}

return (
        <div  className="detailsview-container ms-2">
                {canRender()?
                <Carousel  key={cmmcos.length} interval={null} activeIndex={index} onSelect={handleSelect}>
                {cmmcos.map((cmmco, index) => (
                    
                <Carousel.Item>
                    <Playback key={index} cmmco={cmmco} id={cmmco.md.id} view={"details"} />
                </Carousel.Item>
                ))}
              
            </Carousel>:<h3>No Elements found for the query</h3>
            }

        </div>

);

}

export default DetailsView;