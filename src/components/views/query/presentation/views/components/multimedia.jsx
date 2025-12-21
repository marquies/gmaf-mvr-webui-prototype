import React, { useRef} from 'react';
import MultimediaPlaybackPluginLoader from '../../../../../plugins/playback/multimedia/loader';
import ReactPlayer from 'react-player';
import NoPlugin from '../../../../../plugins/error/noplugin';

function Multimedia(props){

//Load the React Components
const multimediaPlaybackComponents= MultimediaPlaybackPluginLoader;
const {mmco} = props;
var mmcofile= false;
var type=false;
const playerRef = useRef(null); // Create a ref using useRef


function getFileType(fileName) {
    if (!fileName) return 'unknown';
    
    const extension = fileName.toLowerCase().split('.').pop();
    
    // Common image extensions
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension)) {
        return 'image';
    }
    // Common video extensions
    if (['mp4', 'webm', 'ogg', 'mov', 'avi'].includes(extension)) {
        return 'video';
    }
    // Common text extensions
    if (['txt', 'log', 'md', 'rtf', 'json'].includes(extension)) {
        return 'text';
    }
    // CMMCO extensions
    if (['cmmco'].includes(extension)) {
        return 'cmmco';
    }
    
    return 'unknown';
}

function canRender(){

    return mmco && mmco.generalMetadata && mmco.generalMetadata.fileName;
}

function renderContent() {
    if (!canRender()) {
        return <NoPlugin />;
    }

    const previewUrl = "http://localhost:8242/gmaf/gmafApi/gmaf/preview/s/" + mmco.id;
    const fileUrl = "http://localhost:8242/gmaf/gmafApi/gmaf/file/" + mmco.id;
    const fileType = getFileType(mmco.generalMetadata.fileName);

    if (fileType === 'image') {
        return <img src={previewUrl} alt={mmco.generalMetadata.fileName || 'Image preview'} className="img-fluid" />;
    } 
    else if (fileType === 'video') {
        return (
            <ReactPlayer
                ref={playerRef}
                url={fileUrl}
                controls={true}
                width="100%"
                height="100%"
                config={{
                    file: {
                        attributes: {
                            poster: previewUrl
                        }
                    }
                }}
            />
        );
    }
    else if (fileType === 'text') {
        return (
            <div className="text-preview p-2">
                <iframe 
                    src={fileUrl}
                    title={mmco.generalMetadata.fileName || 'Text preview'}
                    className="w-100 h-100 border-0"
                    style={{ minHeight: '200px' }}
                />
            </div>
        );
    }
    else {
        return (
            <div className="unsupported-type p-3 text-center">
                <p>Unsupported file type: {mmco.generalMetadata.fileName}</p>
                <a href={fileUrl} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                    Download File
                </a>
            </div>
        );
    }
}

return (
    <div className={props.view === "details" ? 'playback-multimedia-container-big border-1 border rounded-3' : 'playback-multimedia-container-small border-1 border rounded-3'}>
        {renderContent()}
    </div>
);

}

export default Multimedia;