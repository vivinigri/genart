const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const { lerp } = require("canvas-sketch-util/math");
const palettes = require("nice-color-palettes");

const settings = {
  dimensions: [2048, 2048],
  animate: false,
};

const sketch = () => {
  const palette = random.pick(palettes);
  const color = random.pick(palette);
  let creal = -0.8;
  let cimag = 0.174; //156
  let colors = [];
  // let frame = 0;

  const drawJulia = (context) => {
    for (let y = 0; y < 512; y++) {
      for (let x = 0; x < 512; x++) {
        let cx = -2 + x / 128;
        let cy = -2 + y / 128;
        let i = 0;

        do {
          let xt = cx * cx - cy * cy + creal;
          cy = 2 * cx * cy + cimag;
          cx = xt;
          i++;
        } while (cx * cx + cy * cy < 16 && i < 255);

        // i = i.toString(16);
        context.beginPath();
        context.rect(x * 4, y * 4, 4, 4);
        // context.fillStyle = `#${i}${i}${i}`;
        // context.fillStyle = `${color}${Math.floor((i * 100) / 255)}`;
        context.fillStyle = colors[i];
        context.fill();
      }
    }

    // frame += 1;
    // creal = -0.8 + 0.6 * Math.sin(frame / (3.14 * 20));
    // cimag = 0.156 + 0.4 * Math.cos(frame / (3.14 * 40));
  };

  return ({ context, width, height }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);
    context.scale(1.25, 2);
    context.translate(-210, -512);

    for (let x = 0; x < 128; x++) {
      let color = (32 * x).toString(16);
      if (color.length === 1) {
        color = `0${color}`;
      }
      colors[x] = `#${color}${color}ff`;
      colors[x + 8] = `#00ff${color}`;
      colors[17 + x] = `#${color}0000`;
    }

    drawJulia(context);
  };
};

canvasSketch(sketch, settings);
