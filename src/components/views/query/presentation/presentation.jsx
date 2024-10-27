import React, { } from 'react';
import BrowseView from './views/browseview';
import DetailsView from './views/detailsview';

function Presentation(props) {
    
    const {cmmcos} = props;

    const filedataimg = {url:'https://www.gstatic.com/webp/gallery/1.jpg'};
    const filedataimg2 = {url:'https://picsum.photos/id/237/200/300'};
    const filedatavideo= {url:'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'};
    //Test showresult
    const showresult1 = {
        srd: {},
        pd: {}, 
        mmco: {audio:[], image:  filedataimg, video: [], playbacktype:'image'}, 
        md: {id: "asdas-wewe-asdsad", name: 'test.mp4', description:'golf shot and blue sky', fDate:'10.10.2023', 'tDate':'17.10.2023',creationDate:'10.10.2023' }, 
        wsd: { id:'3D-adventure-Golf', data: {course: '18', coordinates:['23.2', '17.2'] } }
    }

    const showresult2 = {
        srd: {},
        pd: [{id:'threedgolf', name: '3D Golf', description:'golf shot and blue sky', fDate:'10.10.2023', 'tDate':'17.10.2023'}], 
        mmco: {audio:[], image:  [], video: filedatavideo, playbacktype:'video'}, 
        md: {id: "asdasd-wewes-tztzt", name: 'test.mp4', description:'golf shot and blue sky', fDate:'10.10.2023', 'tDate':'17.10.2023',creationDate:'10.10.2023' }, 
        wsd: { id:'3D-adventure-Golf', data: {course: '18', coordinates:['23.2', '17.2'] } }
    }
    const showresult3 = {
        srd: {},
        pd: [{id:'threedgolf', name: '3D Golf', description:'golf shot and blue sky', fDate:'10.10.2023', 'tDate':'17.10.2023'}], 
        mmco: {audio:[], image:  [], video: filedatavideo, playbacktype:'video'}, 
        md: {id: "asdasd-wewes-tztzt", name: 'test.mp4', description:'golf shot and blue sky', fDate:'10.10.2023', 'tDate':'17.10.2023',creationDate:'10.10.2023' }, 
        wsd: { id:'3D-adventure-Golf', data: {course: '18', coordinates:['23.2', '17.2'] } }
    }
        
    const showresult4 = {
        srd: {},
        pd: [{id:'threedgolf', name: '3D Golf', description:'golf shot and blue sky', fDate:'10.10.2023', 'tDate':'17.10.2023'}], 
        mmco: {audio:[], image:  [], video: filedatavideo, playbacktype:'video'}, 
        md: {id: "asdasd-wewes-tztzt", name: 'test.mp4', description:'golf shot and blue sky', fDate:'10.10.2023', 'tDate':'17.10.2023',creationDate:'10.10.2023' }, 
        wsd: { id:'3D-adventure-Golf', data: {course: '18', coordinates:['23.2', '17.2'] } }
    }

    const showresult5 = {
        srd: {},
        pd: {}, 
        mmco: {audio:[], image:  filedataimg2, video: [], playbacktype:'image'}, 
        md: {id: "asdas-wewe-asdsad", name: 'test.mp4', description:'golf shot and blue sky', fDate:'10.10.2023', 'tDate':'17.10.2023',creationDate:'10.10.2023' }, 
        wsd: { id:'3D-adventure-Golf', data: {course: '18', coordinates:['23.2', '17.2'] } }
    }
    const showresult6 = {
        srd: {},
        pd: {}, 
        mmco: {audio:[], image:  filedataimg2, video: [], playbacktype:'image'}, 
        md: {id: "asdas-wewe-asdsad", name: 'test.mp4', description:'golf shot and blue sky', fDate:'10.10.2023', 'tDate':'17.10.2023', creationDate:'10.10.2023' }, 
        wsd: { id:'3D-adventure-Golf', data: {course: '18', coordinates:['23.2', '17.2'] } }
    }    
        
    const showresults= [showresult1, showresult2,showresult5, showresult3, showresult4, showresult6,showresult1, showresult2,showresult5, showresult3, showresult4, showresult6,showresult1, showresult2,showresult5, showresult3, showresult4, showresult6,showresult1, showresult2,showresult5, showresult3, showresult4, showresult6];

    function canRender(index){
      
        return true;
    }
    
    return (
        <div className= {props.presentationView==="Browse View"? "presentation ms-2 overflow-auto": "presentation"}>
            { canRender()?  
                props.presentationView==="Browse View"? 
                    <BrowseView cmmcos={cmmcos} />
                    :<DetailsView cmmcos={cmmcos} />
            : "Could not Render"}
        </div>  
    );
          

}

export default Presentation;