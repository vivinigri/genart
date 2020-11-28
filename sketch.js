const canvasSketch = require("canvas-sketch");
const { lerp } = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");
const palettes = require("nice-color-palettes");

const settings = {
  dimensions: [2048, 2048],
};

const sketch = () => {
  const palette = random
    .shuffle(random.pick(palettes))
    .slice(0, palettes.length);
  //   const emojies = ["🌲", "🌳", "🌴", "🌵", "🌾", "🌿", "☘️", "🍀"];
  const emojies = ["❤️", "🧡", "💛", "💚", "💙", "💜", "🤎", "🖤", "🤍"];
  const createGrid = () => {
    const points = [];
    const count = 150;
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const u = count <= 1 ? 0.5 : x / (count - 1);
        const v = count <= 1 ? 0.5 : y / (count - 1);
        const radius = 0.02 + Math.abs(random.noise2D(u, v)) * 0.02;
        points.push({
          color: random.pick(palette),
          radius: radius,
          position: [u, v],
          rotation: random.noise2D(u, v),
          text: random.pick(emojies),
        });
      }
    }
    return points;
  };

  //   random.setSeed(512);
  const points = createGrid().filter(() => random.value() > 0.5);
  const margin = 200;

  return ({ context, width, height }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    points.forEach((data) => {
      const { position, radius, color, rotation, text } = data;
      const [u, v] = position;
      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);

      /* context.beginPath();
      context.arc(x, y, radius * width, 0, Math.PI * 2, false);
      context.fillStyle = color;
      context.fill(); */

      context.save();
      context.fillStyle = color;
      context.font = `${radius * width}px "Fira Code"`;
      context.translate(x, y);
      context.rotate(rotation);
      context.fillText(text, 0, 0);
      context.restore();
    });
  };
};

canvasSketch(sketch, settings);

// Ctrl + S = saves file image
// Ctrl + K = commits changes to github rep
