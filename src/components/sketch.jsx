import React, { Component } from 'react';

class Sketch extends Component {

    constructor(props) {
        super(props);
        this.state = {  };
      }

      isMouseDown=false;
      canvas = null;
      body = null;
      ctx = null;
      linesArray = [];
      currentSize = 0;
      currentColor = "";
      currentBg = "";

    componentDidMount() {
        
        var isMouseDown=false;
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        var linesArray = [];
        var currentSize = 5;
        var currentColor = "rgb(200,20,100)";
        var currentBg = "white";

        canvas.id = "canvas";
        canvas.width = parseInt(document.getElementById("sizeX").value);
        canvas.height = parseInt(document.getElementById("sizeY").value);
        canvas.style.zIndex = 8;
        canvas.style.position = "absolute";
        canvas.style.border = "1px solid";
        ctx.fillStyle = currentBg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        //Only add canvas if empty 
        if(!document.getElementById("canvas-container").firstChild)
        {
            document.getElementById("canvas-container").appendChild(canvas);
        }
      
                
        // ON MOUSE DOWN
       function mousedown(canvas, evt) {
  
            //var mousePos = getMousePos(canvas, evt);
            isMouseDown=true
            var currentPosition = getMousePos(canvas, evt);
            ctx.moveTo(currentPosition.x, currentPosition.y)
            ctx.beginPath();
            ctx.lineWidth  = currentSize;
            ctx.lineCap = "round";
            ctx.strokeStyle = currentColor;

        }

        
        // GET MOUSE POSITION

        function getMousePos(canvas, evt) {
       
            var rect = canvas.getBoundingClientRect();
            return {
                x: evt.clientX - rect.left,
                y: evt.clientY - rect.top
            };
        }

        // STORE DATA
        function store(x, y, s, c) {
        var line = {
            "x": x,
            "y": y,
            "size": s,
            "color": c
        }
        linesArray.push(line);
    }


        // ON MOUSE MOVE
        function mousemove(canvas, evt) {

            if(isMouseDown){
                var currentPosition = getMousePos(canvas, evt);
                ctx.lineTo(currentPosition.x, currentPosition.y)
                ctx.stroke();
                store(currentPosition.x, currentPosition.y, currentSize, currentColor);
            }
        }

        
        // ON MOUSE UP

        function  mouseup() {
            isMouseDown=false
            store()
        }

        // REDRAW 
        function redraw() {
                for (var i = 1; i < linesArray.length; i++) {
                    ctx.beginPath();
                    ctx.moveTo(linesArray[i-1].x, linesArray[i-1].y);
                    ctx.lineWidth  = linesArray[i].size;
                    ctx.lineCap = "round";
                    ctx.strokeStyle = linesArray[i].color;
                    ctx.lineTo(linesArray[i].x, linesArray[i].y);
                    ctx.stroke();
                }
        }



        // DRAWING EVENT HANDLERS
        canvas.addEventListener('mousedown', function(event) {mousedown(canvas, event);});
        canvas.addEventListener('mousemove',function(event) {mousemove(canvas, event);});
        canvas.addEventListener('mouseup',mouseup);


        document.getElementById('controlSize').addEventListener('change', function(event) {
          
            currentSize = event.target.value;
            document.getElementById("showSize").innerHTML = currentSize;
        });

        document.getElementById('colorpicker').addEventListener('change', function(event) {
            currentColor = event.target.value;
        });

        document.getElementById('bgcolorpicker').addEventListener('change', function(event) {
            ctx.fillStyle = event.target.value;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            redraw();
            currentBg = ctx.fillStyle;
        });
        
        document.getElementById('clear-canvas').addEventListener('click', function()
        {
            currentBg = "white";

            canvas.id = "canvas";
            canvas.width = parseInt(document.getElementById("sizeX").value);
            canvas.height = parseInt(document.getElementById("sizeY").value);
            canvas.style.zIndex = 8;
            canvas.style.position = "absolute";
            canvas.style.border = "1px solid";
            ctx.fillStyle = currentBg;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            if(document.getElementById("canvas-container").firstChild)
            {
                document.getElementById("canvas-container").innerHTML="";
                document.getElementById("canvas-container").appendChild(canvas);
            }

        });

        /*
        // BUTTON EVENT HANDLERS
        document.getElementById('canvasUpdate').addEventListener('click', function() {
            this.createCanvas();
            this.redraw();
        });
        
     
        document.getElementById('saveToImage').addEventListener('click', function() {
            this.downloadCanvas(this, 'canvas', 'masterpiece.png');
        }, false);
        document.getElementById('eraser').addEventListener('click', this.eraser);

        document.getElementById('save').addEventListener('click', this.save);
        //document.getElementById('load').addEventListener('click', load);
        document.getElementById('clearCache').addEventListener('click', function() {
            localStorage.removeItem("savedCanvas");
            this.linesArray = [];
            console.log("Cache cleared!");
        });

        */
    }

    // DOWNLOAD CANVAS
    
    downloadCanvas(link, canvas, filename) {
        link.href = document.getElementById(canvas).toDataURL();
        link.download = filename;
    }

    // SAVE FUNCTION

    save() {
        
        localStorage.removeItem("savedCanvas");
        localStorage.setItem("savedCanvas", JSON.stringify(this.linesArray));
      
    }   

    // LOAD FUNCTION
    load() {
        if (localStorage.getItem("savedCanvas") != null) {
            this.linesArray = JSON.parse(localStorage.savedCanvas);
            var lines = JSON.parse(localStorage.getItem("savedCanvas"));
            for (var i = 1; i < lines.length; i++) {
               this.ctx.beginPath();
               this.ctx.moveTo(this.linesArray[i-1].x, this.linesArray[i-1].y);
               this.ctx.lineWidth  = this.linesArray[i].size;
               this.ctx.lineCap = "round";
               this.ctx.strokeStyle = this.linesArray[i].color;
               this.ctx.lineTo(this.linesArray[i].x, this.linesArray[i].y);
               this.ctx.stroke();
            }
            console.log("Canvas loaded.");
        }
        else {
            console.log("No canvas in memory!");
        }
    }
    // ERASER HANDLING

    eraser() {
        this.currentSize = 50;
        this.currentColor = this.ctx.fillStyle
    }

    render() { 
        return  <div id="sketch" className='d-flex'>
                    <div id="sidebar">
                        <div className="colorButtons">
                            <h3>Colour</h3>
                            <input type="color" id="colorpicker" defaultValue="#c81464" className="colorpicker"/>
                        </div>
                        <div className="colorButtons">
                            <h3>Bg Color</h3>
                            <input type="color" defaultValue="#ffffff" id="bgcolorpicker" className="colorpicker"/>
                        </div>
                        <div className="toolsButtons">
                            <h3>Tools</h3>
                            <button id="eraser" className="btn btn-default"><span className="glyphicon glyphicon-erase" aria-hidden="true"></span></button>
                            <button id="clear" className="btn btn-danger"> <span className="glyphicon glyphicon-repeat" aria-hidden="true"></span></button>
                        </div>
                        <div className="buttonSize">
                            <h3>Size (<span id="showSize">5</span>)</h3>
                            <input type="range" min="1" max="50" defaultValue="5" step="1" id="controlSize" />
                        </div>
                        <div style={{display:"none"}} className="canvasSize">
                            <h3>Canvas</h3>
                            <div className="input-group">
                                <span className="input-group-addon">X</span>
                                <input type="number" id="sizeX" className="form-control" placeholder="sizeX" defaultValue="550" />
                            </div>
                            <div className="input-group">
                                <span className="input-group-addon">Y</span>
                                <input type="number" id="sizeY" className="form-control" placeholder="sizeY" defaultValue="300"/>
                            </div>
                            <input type="button" className="updateSize btn btn-success" defaultValue="Update" id="canvasUpdate"/>
                        </div>
                        <div className="Storage">
                            <h3>Reset</h3>
                            <input type="button" defaultValue="Clear" className="btn btn-warning" id="clear-canvas"/>
                        </div>
                    </div>
                    <div id="canvas-container" className='m-1'></div>
                </div>
    }
}
 
export default Sketch;