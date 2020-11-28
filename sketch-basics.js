const canvasSketch = require("canvas-sketch");

const settings = {
  dimensions: [2048, 2048],
  /*  for printing... */
  //   units: 'cm' //(default px)
  //   pixelsPerInch: 300  //(default - 72)
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = "orange";
    context.fillRect(0, 0, width, height);

    context.fillStyle = "red";
    context.beginPath();
    context.arc(width * 0.5, height * 0.5, width * 0.2, 0, Math.PI * 2);
    context.fill();
    context.lineWidth = width * 0.02;
    context.strokeStyle = "green";
    context.stroke();
  };
};

canvasSketch(sketch, settings);
