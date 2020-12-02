const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const palettes = require("nice-color-palettes");

const settings = {
  dimensions: [2048, 2048],
  animate: true,
};

const sketch = () => {
  const palette = random.pick(palettes);

  const getMousePos = (canvas, evt) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top,
    };
  };

  const canvas = document.querySelector("canvas");
  const w = canvas.clientWidth;
  let deg = 0;

  canvas.addEventListener(
    "mousemove",
    (evt) => {
      const mousePos = getMousePos(canvas, evt);
      deg = Math.floor((mousePos.x * 90) / w);
    },
    false
  );

  const complementary = (color) => {
    return (
      "000000" + ("0xffffff" ^ `0x${color.replace("#", "")}`).toString(16)
    ).slice(-6);
  };

  const drawTree = (context, startX, startY, len, angle, branchWidth, deg) => {
    context.beginPath();
    context.save();
    context.strokeStyle = random.pick(palette);
    context.lineWidth = branchWidth;
    context.translate(startX, startY);
    context.rotate((Math.PI / 180) * angle);
    context.moveTo(0, 0);
    context.lineTo(0, -len);
    if (len < 60) {
      context.stroke();
    }

    if (len < 10) {
      context.restore();
      return;
    }

    drawTree(context, 0, -len, len * 0.75, angle + deg, branchWidth, deg);
    drawTree(context, 0, -len, len * 0.75, angle - deg, branchWidth, deg);

    context.restore();
  };
  const drawTreeOp = (
    context,
    startX,
    startY,
    len,
    angle,
    branchWidth,
    deg
  ) => {
    context.beginPath();
    context.save();
    context.strokeStyle = random.pick(palette);
    context.lineWidth = branchWidth;
    context.translate(startX, startY);
    context.rotate((Math.PI / 180) * angle);
    context.moveTo(0, 0);
    context.lineTo(0, len);
    if (len < 60) {
      context.stroke();
    }

    if (len < 10) {
      context.restore();
      return;
    }

    drawTreeOp(context, 0, len, len * 0.75, angle + deg, branchWidth, deg);
    drawTreeOp(context, 0, len, len * 0.75, angle - deg, branchWidth, deg);

    context.restore();
  };

  return ({ context, width, height }) => {
    context.fillStyle = `#${complementary(palette[0])}`;
    context.fillRect(0, 0, width, height);

    context.lineWidth = 5;
    drawTree(context, width / 2, height - 270, 360, 0, 30, deg);
    drawTreeOp(context, width / 2, 270, 360, 0, 30, deg);
  };
};

canvasSketch(sketch, settings);
