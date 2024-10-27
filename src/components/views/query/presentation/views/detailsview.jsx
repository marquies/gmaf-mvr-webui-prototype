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
    
    if(cmmcos === false || typeof(cmmcos) != 'object'){
        return false;
    }

    return true;
}

return (
        <div  className="detailsview-container">
                {canRender()?
                <Carousel interval={null} activeIndex={index} onSelect={handleSelect}>
                {props.showresults.map((showresult, index) => (
                    
                <Carousel.Item>
                    <Playback cmmco={showresult} id={showresult.md.id} view={"details"} />
                </Carousel.Item>
                ))}
              
            </Carousel>:""
            }

        </div>

);

}

export default DetailsView;