const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const palettes = require("nice-color-palettes");

const settings = {
  // dimensions: [2048, 2048],
  dimensions: [1920, 1080],
  // dimensions: [1080, 1920],
  animate: true,
};

/**
 * PORTRAIT
 * dimensions: [1080, 1920],
 * 
 * var maxX = 1080 + maxMaxRad;
  var minY = 960 - 10;
  var maxY = 960 + 10;
 * 
 */

/**
 * LANDSCAPE
 * dimensions: [1920, 1080],
 * 
 * var maxX = 1920 + maxMaxRad;
  var minY = 540 - 10;
  var maxY = 540 + 10;
 * 
 */

const sketch = () => {
  // const palette = random.pick(palettes);
  /* NIGHT OWL */
  const palette = [
    "#D6DEEB",
    "#7E57C25A",
    "#FF6363",
    "#F78C6C",
    "#C792EA",
    "#82AAFF",
    "#ECC48DFF",
    "#ADDB67",
    "#7FDBCA",
    "#FF2C83",
  ];
  var numCircles = 18;
  var maxMaxRad = 300; //1024 --> muda a amplitude de Y
  var minMaxRad = 300; //1024
  var minRadFactor = 0;
  var circles = [];
  var iterations = 10;
  var numPoints = Math.pow(2, iterations) + 1;
  var drawsPerFrame = 40;
  var lineWidth = 5;
  var colorArray = [];
  var minX = -maxMaxRad;
  var maxX = 1920 + maxMaxRad; //2048 - ...
  var minY = 540 - 10; //1024
  var maxY = 540 + 10; //1024
  var lineNumber = 0;
  var twistAmount = 1.2 * Math.PI * 2; //.87
  var fullTurn = (Math.PI * 2 * numPoints) / (1 + numPoints);
  /*   var lineAlpha = 0.1;
  var maxColorValue = 100;
  var minColorValue = 20; */
  var stepsPerSegment = Math.floor(800 / numCircles);
  var init = true;

  const startGenerate = () => {
    drawCount = 0;
    /* context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, width, height); */
    setCircles();

    colorArray = setColorList(iterations);
    lineNumber = 0;
  };
  const setCircles = () => {
    var i;
    circles = [];

    for (i = 0; i < numCircles; i++) {
      maxR = minMaxRad + Math.random() * (maxMaxRad - minMaxRad);
      minR = minRadFactor * maxR;

      var newCircle = {
        centerX: minX + (i / (numCircles - 1)) * (maxX - minX),
        centerY: minY + (i / (numCircles - 1)) * (maxY - minY),
        maxRad: maxR,
        minRad: minR,
        phase: (i / (numCircles - 1)) * twistAmount,
        pointArray: setLinePoints(iterations),
      };
      circles.push(newCircle);
    }
  };
  const setLinePoints = (iterations) => {
    var pointList = {};
    var pointArray = [];
    pointList.first = { x: 0, y: 1 };
    var lastPoint = { x: 1, y: 1 };
    var minY = 1;
    var maxY = 1;
    var point;
    var nextPoint;
    var dx, newX, newY;
    var ratio;

    var minRatio = 0.5;

    pointList.first.next = lastPoint;
    for (var i = 0; i < iterations; i++) {
      point = pointList.first;
      while (point.next != null) {
        nextPoint = point.next;

        dx = nextPoint.x - point.x;
        newX = 0.5 * (point.x + nextPoint.x);
        newY = 0.5 * (point.y + nextPoint.y);
        newY += dx * (Math.random() * 2 - 1);

        var newPoint = { x: newX, y: newY };

        //min, max
        if (newY < minY) {
          minY = newY;
        } else if (newY > maxY) {
          maxY = newY;
        }

        //put between points
        newPoint.next = nextPoint;
        point.next = newPoint;

        point = nextPoint;
      }
    }

    if (maxY != minY) {
      var normalizeRate = 1 / (maxY - minY);
      point = pointList.first;
      while (point != null) {
        point.y = normalizeRate * (point.y - minY);
        pointArray.push(point.y);
        point = point.next;
      }
    }
    //unlikely that max = min, but could happen if using zero iterations. In this case, set all points equal to 1.
    else {
      point = pointList.first;
      while (point != null) {
        point.y = 1;
        pointArray.push(point.y);
        point = point.next;
      }
    }

    return pointArray;
  };
  const setColorList = (iter) => {
    /* var r0, g0, b0;
    var r1, g1, b1;
    var param;
    var colorArray;
    var i, len;

    r0 = minColorValue + Math.random() * (maxColorValue - minColorValue);
    g0 = minColorValue + Math.random() * (maxColorValue - minColorValue);
    b0 = minColorValue + Math.random() * (maxColorValue - minColorValue);

    r1 = minColorValue + Math.random() * (maxColorValue - minColorValue);
    g1 = minColorValue + Math.random() * (maxColorValue - minColorValue);
    b1 = minColorValue + Math.random() * (maxColorValue - minColorValue);

    a = lineAlpha;
*/
    var colorParamArray = setLinePoints(iter);
    colorArray = [];

    len = colorParamArray.length;

    for (i = 0; i < len; i++) {
      /* param = colorParamArray[i];

      r = Math.floor(r0 + param * (r1 - r0));
      g = Math.floor(g0 + param * (g1 - g0));
      b = Math.floor(b0 + param * (b1 - b0));

       var newColor = "rgba(" + r + "," + g + "," + b + "," + a + ")";
      colorArray.push(newColor); */
      var newColor = random.pick(palette);
      colorArray.push(newColor);
    }

    return colorArray;
  };
  const onTimer = (context) => {
    var i;
    var theta;
    var numCircles = circles.length;
    var linParam;
    var cosParam;
    var centerX, centerY;
    var xSqueeze = 0.75;
    var x0, y0;
    var rad, rad0, rad1;
    var phase, phase0, phase1;

    for (var k = 0; k < drawsPerFrame; k++) {
      theta = (lineNumber / (numPoints - 1)) * fullTurn;

      // context.globalCompositeOperation = "lighter";
      context.lineJoin = "miter";
      context.strokeStyle = colorArray[lineNumber];
      context.lineWidth = lineWidth;
      context.beginPath();

      centerX = circles[0].centerX;
      centerY = circles[0].centerY;
      rad =
        circles[0].minRad +
        circles[0].pointArray[lineNumber] *
          (circles[0].maxRad - circles[0].minRad);
      phase = circles[0].phase;
      x0 = centerX + xSqueeze * rad * Math.cos(theta + phase);
      y0 = centerY + rad * Math.sin(theta + phase);
      context.moveTo(x0, y0);

      for (i = 0; i < numCircles - 1; i++) {
        rad0 =
          circles[i].minRad +
          circles[i].pointArray[lineNumber] *
            (circles[i].maxRad - circles[i].minRad);
        rad1 =
          circles[i + 1].minRad +
          circles[i + 1].pointArray[lineNumber] *
            (circles[i + 1].maxRad - circles[i + 1].minRad);
        phase0 = circles[i].phase;
        phase1 = circles[i + 1].phase;

        for (j = 0; j < stepsPerSegment; j++) {
          linParam = j / (stepsPerSegment - 1);
          cosParam = 0.5 - 0.5 * Math.cos(linParam * Math.PI);

          centerX =
            circles[i].centerX +
            linParam * (circles[i + 1].centerX - circles[i].centerX);
          centerY =
            circles[i].centerY +
            cosParam * (circles[i + 1].centerY - circles[i].centerY);

          rad = rad0 + cosParam * (rad1 - rad0);
          phase = phase0 + cosParam * (phase1 - phase0);
          x0 = centerX + xSqueeze * rad * Math.cos(theta + phase);
          y0 = centerY + rad * Math.sin(theta + phase);
          context.lineTo(x0, y0);
        }
      }

      context.stroke();

      lineNumber++;
    }
  };

  return ({ context, width, height }) => {
    if (init) {
      init = false;
      // context.fillStyle = random.pick(palette);
      context.fillStyle = "#011627";
      context.fillRect(0, 0, width, height);
      startGenerate();
    }
    onTimer(context);
  };
};

canvasSketch(sketch, settings);
