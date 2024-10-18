import React, {useState} from 'react';
import Playback from './playback';
import PlugInError from '../plugins/error/pluginerror';
import Carousel from 'react-bootstrap/Carousel';


function DetailsView(props){

    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex) => {
        console.log("Selected index: ", selectedIndex);
      setIndex(selectedIndex);
    };

function canRender(index){
console.log(props.showresults);
    if(props.showresults !== undefined && props.showresults[index] !== undefined && props.showresults[index].md !== undefined && props.showresults[index].md.id !== undefined){

        return true;
    }  
    //console.error("Presentation Data incomplete for props.Showresults index :", index);
    return false;
}

return (
        <div  className="detailsview-container">
          
            <Carousel activeIndex={index} onSelect={handleSelect}>
            {props.showresults.map((showresult, index) => (
                
            <Carousel.Item>
                <Playback cmmco={showresult} id={showresult.md.id} view={"details"} />
            </Carousel.Item>
        ))}
              
            </Carousel>


        </div>

);

}

export default DetailsView;