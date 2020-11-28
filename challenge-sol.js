const canvasSketch = require("canvas-sketch");
const { lerp } = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");
const palettes = require("nice-color-palettes");

const settings = {
  dimensions: [2048, 2048],
};

const sketch = () => {
  const palette = random.pick(palettes);

  const polyPoints = () => {
    const points = [];

    const count = 6;
    const numPolys = 50;
    for (let index = 0; index < numPolys; index++) {
      const p1 = [
        random.rangeFloor(0, count) / (count - 1),
        random.rangeFloor(0, count - 1) / (count - 1),
      ];
      const p2 = [
        random.rangeFloor(0, count) / (count - 1),
        random.rangeFloor(0, count - 1) / (count - 1),
      ];
      points.push([p1, p2, [p2[0], 1], [p1[0], 1]]);
    }

    return points;
  };

  const polys = polyPoints();
  const margin = 200;

  return ({ context, width, height }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    polys.forEach((data) => {
      const [p1, p2, p3, p4] = data;
      context.beginPath();
      context.moveTo(
        lerp(margin, width - margin, p1[0]),
        lerp(margin, width - margin, p1[1])
      );
      context.lineTo(
        lerp(margin, width - margin, p2[0]),
        lerp(margin, width - margin, p2[1])
      );
      context.lineTo(
        lerp(margin, width - margin, p3[0]),
        lerp(margin, width - margin, p3[1])
      );
      context.lineTo(
        lerp(margin, width - margin, p4[0]),
        lerp(margin, width - margin, p4[1])
      );
      context.fillStyle = `${random.pick(palette)}${random.rangeFloor(10, 80)}`;
      context.fill();
    });
  };
};

canvasSketch(sketch, settings);
