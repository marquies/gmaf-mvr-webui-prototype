import React, {useState, useEffect,useRef} from 'react';

function ThreeDGolf() {
    
    const canvasRef = useRef(null);
    const [dotPosition, setDotPosition] = useState(null);
    const imageSrc = "pluginmedia/Golftrack.PNG";
    const containerWidth = 380;
    const containerHeight = 380;
  
    useEffect(() => {
  
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const img = new Image();
  
      img.src = imageSrc;
      img.onload = () => {
        let width = img.width;
        let height = img.height;
  
        // Scale image to fit container while maintaining aspect ratio
        if (containerWidth && containerHeight) {
          const aspectRatio = img.width / img.height;
          if (containerWidth / containerHeight > aspectRatio) {
            height = containerHeight;
            width = height * aspectRatio;
          } else {
            width = containerWidth;
            height = width / aspectRatio;
          }
        }
  
        canvas.width = width;
        canvas.height = height;
  
        // Draw the image on the canvas
        ctx.drawImage(img, 0, 0, width, height);
  
        // Draw the dot if it exists
        if (dotPosition) {
          drawDot(ctx, dotPosition.x, dotPosition.y);
        }
      };
    }, [imageSrc, containerWidth, containerHeight, dotPosition]);
  
    const drawDot = (ctx, x, y) => {
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = "red";
      ctx.fill();
    };
  
    const handleCanvasClick = (event) => {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
  
      // Update the dot position
      setDotPosition({ x, y });
    };
  
    return (
      <canvas className="mt-3 ms-3"
        ref={canvasRef}
        onClick={handleCanvasClick}
        style={{
          border: "1px solid black",
          cursor: "crosshair",
          display: "block",
          maxWidth: "100%",
        }}
      />
    );
  };

export default ThreeDGolf;