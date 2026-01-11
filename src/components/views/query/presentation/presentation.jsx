import React from 'react';
import BrowseView from './views/browseview';
import DetailsView from './views/detailsview';

function Presentation(props) {

    function getView(){
        switch(props.presentationView) {
            case "browse":
              return <BrowseView updateStatus={props.updateStatus} page={props.page} numberOfPages={props.numberOfPages} cmmcos={props.cmmcos} deletable={props.deletable} onSelectItem={props.onSelectItem} numOfAllResults={props.numOfAllResults} onAddQueryExample={props.onAddQueryExample}/>;
            case "details":
              return <DetailsView updateStatus={props.updateStatus} page={props.page} numberOfPages={props.numberOfPages} cmmcos={props.cmmcos} deletable={props.deletable} onAddQueryExample={props.onAddQueryExample}/>;
            default:
              return <BrowseView updateStatus={props.updateStatus} page={props.page} numberOfPages={props.numberOfPages} cmmcos={props.cmmcos} deletable={props.deletable} onSelectItem={props.onSelectItem} numOfAllResults={props.numOfAllResults} onAddQueryExample={props.onAddQueryExample}/>;
          }
    }

    return (
        <div className='presentation-container d-flex flex-column' style={{ height: '100vh', maxWidth: '800px' }}>
            <div className="flex-grow-1 overflow-auto">
                {getView()}
            </div>
        </div>
    );
}

export default Presentation;