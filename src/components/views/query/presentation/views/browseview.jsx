import React, { useState, useEffect } from 'react';
import Playback from './components/playback';

function BrowseView(props) {
    const [selectedId, setSelectedId] = useState(null);
    const [showAlert, setShowAlert] = useState(true);
    const cmmcos = props.cmmcos;

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowAlert(false);
        }, 3000); // fade out after 3 seconds

        return () => clearTimeout(timer);
    }, []);

    function canRender() {
        return cmmcos && cmmcos.length > 0;
    }

    const handleSelect = (id) => {
        setSelectedId(id);
        props.onSelectItem(id);
    };

    return (
        <div className="card border-primary shadow" style={{ width: "100%" }}>
            <div className="card-header bg-primary text-white">
                <h5 className="card-title mb-0">Result Browser</h5>
            </div>
            <div className="card-body">
                {canRender() ? (
                    <div>
                        <div 
                            className={`alert alert-primary ${showAlert ? 'show' : 'hide'}`}
                            style={{
                                transition: 'opacity 0.5s ease-out',
                                opacity: showAlert ? 1 : 0,
                                height: showAlert ? 'auto' : 0,
                                overflow: 'hidden',
                                marginBottom: showAlert ? '1rem' : 0,
                                transitionProperty: 'opacity, height, margin',
                                transitionDuration: '0.5s'
                            }}
                            role="alert"
                        >
                            Found {props.numOfAllResults} results... select to see details
                        </div>
                        <div className='d-flex flex-wrap flex-start gap'>
                            {cmmcos.map((cmmco) => (
                                <Playback 
                                    key={cmmco?.id} 
                                    cmmco={cmmco} 
                                    id={cmmco?.id} 
                                    view={"browse"} 
                                    isSelected={selectedId === cmmco?.id}
                                    onSelect={() => handleSelect(cmmco.id)}
                                />
                            ))}
                        </div>
                    </div>
                ) : ""}
            </div>
        </div>
    );
}

export default BrowseView;