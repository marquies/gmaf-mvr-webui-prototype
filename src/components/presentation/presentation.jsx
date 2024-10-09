import React, { Component } from 'react';
import Multimedia from './multimedia';
import Playback from './playback';

function Presentation(props) {
    
    const filedataimg = {url:'https://www.gstatic.com/webp/gallery/1.jpg'};
    const filedatavideo= {url:'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'};
    //Test showresult
    const showresult1 = {
        srd: {},
        pd: {}, 
        mmco: {audio:[], image:  filedataimg, video: [], playbacktype:'image'}, 
        md: {name: 'test.mp4', description:'golf shot and blue sky', fDate:'10.10.2023', 'tDate':'17.10.2023' }, 
        wsd: { id:'3D-adventure-Golf', data: {course: '18', coordinates:['23.2', '17.2'] } }
    }

    const showresult2 = {
        srd: {},
        pd: {}, 
        mmco: {audio:[], image:  [], video: filedatavideo, playbacktype:'video'}, 
        md: {name: 'test.mp4', description:'golf shot and blue sky', fDate:'10.10.2023', 'tDate':'17.10.2023' }, 
        wsd: { id:'3D-adventure-Golf', data: {course: '18', coordinates:['23.2', '17.2'] } }
    }
        
    const showresults= [showresult1, showresult2];
    
    return (
        <div className='presentation'> Presentation 
            <div>
                {showresults.map((showresult) => (
                    <Playback cmmco={showresult} />
                ))}
            </div>
        </div>  
    );

}

export default Presentation;