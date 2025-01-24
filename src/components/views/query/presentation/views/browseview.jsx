import React, { useState } from 'react';
import Playback from './components/playback';

function BrowseView(props) {
    const [cmmcos, setCmmcos] = useState(props.cmmcos);

    function canRender() {
        if (cmmcos === false || typeof (cmmcos) != 'object') {
            return false;
        }
        return true;
    }

    return (
        <div className="card border-primary shadow" style={{ width: "100%" }}>
            <div className="card-header bg-primary text-white">
                <h5 className="card-title mb-0">Result Browser</h5>
            </div>
            <div className="card-body">
                {canRender() ? (
                    <div className='d-flex flex-wrap flex-start gap'>
                        {cmmcos.map((cmmco) => (
                            <Playback key={cmmco.id} cmmco={cmmco} id={cmmco.md.id} view={"browse"} />
                        ))}
                    </div>
                ) : ""}
            </div>
        </div>
    );
}

export default BrowseView;