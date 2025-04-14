import React, { useState } from 'react';

function PdPlayer({ mmfgid }) {
    const [activeImage, setActiveImage] = useState(0);
    const images = [
        {
            src: '/pluginmedia/hr.png',
            title: 'Heart Rate',
            id: 'hr'
        },
        {
            src: '/pluginmedia/gyro.png',
            title: 'Gyroscope',
            id: 'gyro'
        },
        {
            src: '/pluginmedia/emotions.png',
            title: 'Emotions',
            id: 'emotions'
        }
    ];

    return (
        <div className="pd-player-container mt-3">
            <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h6 className="mb-0">PD Player</h6>
                    <div className="btn-group">
                        {images.map((image, index) => (
                            <button
                                key={image.id}
                                type="button"
                                className={`btn btn-sm ${activeImage === index ? 'btn-primary' : 'btn-outline-primary'}`}
                                onClick={() => setActiveImage(index)}
                            >
                                {image.title}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="card-body p-0">
                    <div id="pdCarousel" className="carousel slide" data-bs-ride="carousel" data-bs-interval="false">
                        <div className="carousel-inner">
                            {images.map((image, index) => (
                                <div key={image.id} className={`carousel-item ${index === activeImage ? 'active' : ''}`}>
                                    <img
                                        src={image.src}
                                        className="d-block w-100"
                                        alt={image.title}
                                        style={{ height: '300px', objectFit: 'contain', backgroundColor: '#f8f9fa' }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PdPlayer;
