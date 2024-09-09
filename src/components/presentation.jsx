import React, { Component } from 'react';
import VideoCard from './videocard';

//Window where the app functions are displayed, changes content by clicking navbar
class Content extends Component {
    state = { 
        swipeElement:0
    } 

    constructor(){
        super()
        this.siwpeLeft= this.siwpeLeft.bind(this);
        this.swipeRight= this.swipeRight.bind(this);
       
    }

   
    swipeRight(){
        
        var current= this.state.swipeElement;
        var next= current+1;
        if(this.props.queryresults[next])
        {
            this.setState({swipeElement: next});
        }

    }

    siwpeLeft(){

        var current= this.state.swipeElement;
        var next= current-1;
        if(this.props.queryresults[next])
        {
            this.setState({swipeElement: next});
        }

    }

    render() { 
        return <div id="presentation" className='d-flex ms-1 mt-5' key="content"> 
        {this.props.mode==="static card"?
        <div className='d-flex'>
            {this.props.queryresults.map((item, x) => (
                        <VideoCard setCollectionState={this.props.setCollectionState} key={x} type={item.type} id={item.id} url= {item.url} playbacks={item.playbacks} metadata={item.metadata}/>
            ))}
            </div>:""}
            <button hidden={true} id="dynamic-swipe-button" data-bs-toggle="modal" data-bs-target="#dynamicSwipeModal"></button>
            <div className="modal fade" id="dynamicSwipeModal" tabIndex="-1" aria-labelledby="dynamicSwipeModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-extralg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="dynamicSwipeModalLabel">Dynamic Swipe View</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                        {this.props.mode==="dynamic swipe" && this.props.queryresults[this.state.swipeElement]?
                        <div>
                            <VideoCard setCollectionState={this.props.setCollectionState} smallcard={false} key={this.state.swipeElement} type={this.props.queryresults[this.state.swipeElement].type} id={this.props.queryresults[this.state.swipeElement].id} url= {this.props.queryresults[this.state.swipeElement].url} playbacks={this.props.queryresults[this.state.swipeElement].playbacks} metadata={this.props.queryresults[this.state.swipeElement].metadata}/>  
                        </div>
                        
                        :""
                        }
                        </div>
                       
                        <div className="modal-footer">
                            <div className='center'>
                                <button onClick={this.siwpeLeft} type="button" className='btn border border-secondary rounded-1 m-1'><span className="fa fa-minus"></span></button>
                                <button onClick={this.swipeRight} type="button" className='btn border border-secondary rounded-1 m-1'><span className="fa fa-plus"></span></button>
                            </div>
                        </div>
                        <div className='d-flex'> 
                            <div className='w-50 bg-success'> 
                                {this.props.queryresults.map((item, x) => (
                                <VideoCard setCollectionState={this.props.setCollectionState} smallcard={true} key={x} type={item.type} id={item.id} url= {item.url} playbacks={item.playbacks} metadata={item.metadata}/>
                                ))}             
                            </div>
                            <div className= "w-50 bg-danger"> 
                            {this.props.queryresults.map((item, x) => (
                                <VideoCard setCollectionState={this.props.setCollectionState} smallcard={true} key={x} type={item.type} id={item.id} url= {item.url} playbacks={item.playbacks} metadata={item.metadata}/>
                                ))}  
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        
            
    }
   
}
 
export default Content