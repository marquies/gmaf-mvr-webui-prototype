import React, { useState, useEffect } from 'react';
import Playback from './components/playback';
import Filter from '../../query/filter';

function BrowseView(props) {
    const [selectedId, setSelectedId] = useState(null);
    const [showAlert, setShowAlert] = useState(true);
    const [filteredResults, setFilteredResults] = useState(props.cmmcos || []);
    const [filterUnfolded, setFilterUnfolded] = useState(true);

    useEffect(() => {
        setFilteredResults(props.cmmcos || []);
    }, [props.cmmcos]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowAlert(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    function canRender() {
        return filteredResults && filteredResults.length > 0;
    }

    const handleSelect = (id) => {
        setSelectedId(id);
        props.onSelectItem(id);
    };

    const handleFilterChange = (newFilter) => {
        if (!props.cmmcos || !Array.isArray(props.cmmcos)) {
            setFilteredResults([]);
            return;
        }
        
        let filtered = [...props.cmmcos];
        
        if (newFilter.name) {
            filtered = filtered.filter(result => 
                result.generalMetadata?.fileName?.toLowerCase().includes(newFilter.name.toLowerCase())
            );
        }

        if (newFilter.fromDate) {
            filtered = filtered.filter(result => {
                const resultDate = new Date(result.generalMetadata?.creationDate);
                return resultDate >= newFilter.fromDate;
            });
        }

        if (newFilter.toDate) {
            filtered = filtered.filter(result => {
                const resultDate = new Date(result.generalMetadata?.creationDate);
                return resultDate <= newFilter.toDate;
            });
        }

        if (newFilter.type) {
            filtered = filtered.filter(result => 
                result.generalMetadata?.type === newFilter.type
            );
        }

        setFilteredResults(filtered);
    };

    return (
        <div className="card border-primary shadow" style={{ width: "100%" }}>
            <div className="card-header bg-primary text-white">
                <h5 className="card-title mb-0">Result Browser</h5>
            </div>
            <div className="card-body">
                <div className="accordion mb-3">
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button
                                className={`accordion-button ${!filterUnfolded ? "collapsed" : ""}`}
                                type="button"
                                onClick={() => setFilterUnfolded(!filterUnfolded)}
                            >
                                Filter Results
                            </button>
                        </h2>
                        <div className={`accordion-collapse collapse ${filterUnfolded ? "show" : ""}`}>
                            <div className="card-body">
                                <Filter setFilter={handleFilterChange} />
                            </div>
                        </div>
                    </div>
                </div>
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
                            {filteredResults.map((cmmco) => (
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