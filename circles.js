const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const palettes = require("nice-color-palettes");

const settings = {
  dimensions: [2048, 2048],
};

const sketch = () => {
  const palette = random.pick(palettes);
  const radius = 0.25;

  return ({ context, width, height }) => {
    context.fillStyle = palette[4];
    context.fillRect(0, 0, width, height);
    context.lineWidth = 18;

    for (let i = 0; i < 120; i++) {
      context.beginPath();
      context.strokeStyle = `${palette[i % 4]}20`;
      context.arc(
        width * 0.5 + width * 0.25 * Math.cos(i * 3),
        height * 0.5 + height * 0.25 * Math.sin(i * 3),
        height * radius,
        0,
        Math.PI * 2
      );
      context.stroke();
      context.beginPath();
      context.arc(
        width * 0.25 * Math.cos(i * 3),
        height * 0.25 * Math.sin(i * 3),
        height * radius,
        0,
        Math.PI * 2
      );
      context.stroke();
      context.beginPath();
      context.arc(
        width * 0.25 * Math.cos(i * 3),
        height + height * 0.25 * Math.sin(i * 3),
        height * radius,
        0,
        Math.PI * 2
      );
      context.stroke();
      context.beginPath();
      context.arc(
        width + width * 0.25 * Math.cos(i * 3),
        height + height * 0.25 * Math.sin(i * 3),
        height * radius,
        0,
        Math.PI * 2
      );
      context.stroke();
      context.beginPath();
      context.arc(
        width + width * 0.25 * Math.cos(i * 3),
        height * 0.25 * Math.sin(i * 3),
        height * radius,
        0,
        Math.PI * 2
      );
      context.stroke();
    }
  };
};

canvasSketch(sketch, settings);
