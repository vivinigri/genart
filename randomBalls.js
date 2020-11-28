const canvasSketch = require("canvas-sketch");
// linear interpolation (min, max, t) => t between 0 & 1
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
  const createGrid = () => {
    const points = [];
    const count = 40;
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        // value between 0 & 1 (uv coordinades)
        // count - 1 para ocupar a tela toda
        // condicao e para nao divididor por 0 (se count for 1)
        const u = count <= 1 ? 0.5 : x / (count - 1);
        const v = count <= 1 ? 0.5 : y / (count - 1);
        // const radius = Math.abs(random.noise2D(u, v)) * 0.05;
        points.push({
          // gaussian -> beatween -3.5 & 3.5
          color: random.pick(palette),
          radius: Math.abs(0.01 + random.gaussian() * 0.01), //radius
          position: [u, v],
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
      const { position, radius, color } = data;
      const [u, v] = position;
      // scale the values
      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);

      context.beginPath();
      context.arc(x, y, radius * width, 0, Math.PI * 2, false);
      context.fillStyle = color;
      context.fill();
      //   context.lineWidth = 10;
      // context.stroke();
    });
  };
};

canvasSketch(sketch, settings);

/*********** Using Noises
 *
 * // using frequency:
 * const frequency = 5.0;
 * const v = noise2D(x * frequency, y * frequency)
 *
 * // value is in -1...1 range
 * const v = noise2D(x, y);
 *
 * // map to 0...1 range
 * const n = v * 0.5 + 0.5
 *
 * // turn into a percentage
 * const L = Math.floor(n * 100);
 *
 * // get color value
 * const hsl = `hsl(0, 0%, ${L}%)`;
 *
 * ****/
