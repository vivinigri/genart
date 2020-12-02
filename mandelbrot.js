const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const palettes = require("nice-color-palettes");

const settings = {
  dimensions: [2048, 2048],
};

const sketch = () => {
  const palette = random.pick(palettes);

  const checkIfBelongsToMandelbrotSet = (x, y) => {
    var realComponentOfResult = x;
    var imaginaryComponentOfResult = y;
    var maxIterations = 100;
    for (var i = 0; i < maxIterations; i++) {
      var tempRealComponent =
        realComponentOfResult * realComponentOfResult -
        imaginaryComponentOfResult * imaginaryComponentOfResult +
        x;
      var tempImaginaryComponent =
        2 * realComponentOfResult * imaginaryComponentOfResult + y;
      realComponentOfResult = tempRealComponent;
      imaginaryComponentOfResult = tempImaginaryComponent;

      if (realComponentOfResult * imaginaryComponentOfResult > 5)
        return (i / maxIterations) * 100;
    }
    return 0;
  };

  return ({ context, width, height }) => {
    context.fillStyle = palette[0];
    context.fillRect(0, 0, width, height);

    var magnificationFactor = 600;
    var panX = 0;
    var panY = 0;
    for (var x = 0; x < width; x++) {
      for (var y = 0; y < height; y++) {
        var belongsToSet = checkIfBelongsToMandelbrotSet(
          x / magnificationFactor - panX,
          y / magnificationFactor - panY
        );
        if (belongsToSet == 0) {
          context.fillStyle = palette[0];
          context.fillRect(x, y, 1, 1); // Draw a black pixel
        } else {
          context.fillStyle = "hsl(30, 50%, " + belongsToSet + "%)";
          context.fillRect(x, y, 1, 1); // Draw a colorful pixel
        }
      }
    }
  };
};

canvasSketch(sketch, settings);
