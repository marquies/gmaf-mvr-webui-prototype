import React from 'react';
import BrowseView from './views/browseview';
import DetailsView from './views/detailsview';

function Presentation(props) {
    const view = props.presentationView === "details"
        ? <DetailsView cmmcos={props.cmmcos} numOfAllResults={props.numOfAllResults} />
        : <BrowseView cmmcos={props.cmmcos} numOfAllResults={props.numOfAllResults} onSelectItem={props.onSelectItem} onAddQueryExample={props.onAddQueryExample} />;

    return (
        <div className='presentation-container d-flex flex-column' style={{ height: '100vh', maxWidth: '800px' }}>
            <div className="flex-grow-1 overflow-auto">
                {view}
            </div>
        </div>
    );
}

export default Presentation;
