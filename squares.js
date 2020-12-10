const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const palettes = require("nice-color-palettes");

const settings = {
  dimensions: [2048, 2048],
};

const sketch = () => {
  const palette = random.pick(palettes);
  const lado = 512;

  return ({ context, width, height }) => {
    context.fillStyle = palette[4];
    context.fillRect(0, 0, width, height);

    context.lineWidth = 10;
    for (let i = 0; i < 120; i++) {
      context.strokeStyle = `${palette[i % 3]}20`;
      context.beginPath();
      context.rect(
        width * 0.5 + width * 0.25 * Math.cos(i * 3) - lado,
        height * 0.5 + height * 0.25 * Math.sin(i * 3) - lado,
        lado * 2,
        lado * 2
      );
      context.stroke();
      context.beginPath();
      context.rect(
        width * 0.25 * Math.cos(i * 3) - lado,
        height * 0.25 * Math.sin(i * 3) - lado,
        lado * 2,
        lado * 2
      );
      context.stroke();
      context.beginPath();
      context.rect(
        width + width * 0.25 * Math.cos(i * 3) - lado,
        height + height * 0.25 * Math.sin(i * 3) - lado,
        lado * 2,
        lado * 2
      );
      context.stroke();
    }
  };
};

canvasSketch(sketch, settings);
