const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const palettes = require("nice-color-palettes");

const settings = {
  dimensions: [2048, 2048],
};

const sketch = () => {
  const palette = random.pick(palettes);
  const line = 512;

  return ({ context, width, height }) => {
    const bg = random.pick(palette);
    palette.splice(palette.indexOf(bg), 1);
    context.fillStyle = bg;
    context.fillRect(0, 0, width, height);

    for (let i = 0; i < 90; i++) {
      const rand = (1 + (i % 4)) * random.noise2D(width * 0.5, height * 0.5);
      const radius = line * random.gaussian() * rand * 2;
      const size = random.gaussian();
      context.save();
      context.lineWidth = 4;
      context.strokeStyle = `${palette[i % 4]}70`;
      context.fillStyle = `${palette[i % 4]}30`;
      context.translate(width * 0.5, height * 0.5);
      context.rotate(i * 2);
      context.beginPath();
      context.moveTo(-line * size * rand, -line * rand);
      context.lineTo(-line, radius);
      context.lineTo(line, radius);
      context.lineTo(-line * size * rand, -line * rand);
      context.stroke();
      context.fill();
      context.restore();
    }
  };
};

canvasSketch(sketch, settings);
