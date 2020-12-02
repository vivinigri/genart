const canvasSketch = require("canvas-sketch");

const settings = {
  dimensions: [2048, 2048],
  animate: true,
};

const sketch = () => {
  const baseRad = (Math.PI * 2) / 6;
  const opts = {
    len: 64,
    count: 20,
    baseTime: 10,
    addedTime: 10,
    dieChance: 0.05,
    spawnChance: 10,
    sparkChance: 0.1,
    sparkDist: 10,
    sparkSize: 2,

    color: "hsl(hue,100%,light%)",
    baseLight: 50,
    addedLight: 10,
    shadowToTimePropMult: 6,
    baseLightInputMultiplier: 0.01,
    addedLightInputMultiplier: 0.02,

    cx: 512,
    cy: 512,
    repaintAlpha: 0.04,
    hueChange: 0.2,
  };

  const dieX = 1024 / opts.len;
  const dieY = 1024 / opts.len;
  let tick = 0;

  class Line {
    constructor(context) {
      this.context = context;
      this.reset();
    }
    reset() {
      this.x = 0;
      this.y = 0;
      this.addedX = 10;
      this.addedY = 10;

      this.rad = 0;

      this.lightInputMultiplier =
        opts.baseLightInputMultiplier +
        opts.addedLightInputMultiplier * Math.random();

      this.color = opts.color.replace("hue", tick * opts.hueChange);
      this.cumulativeTime = 0;

      this.beginPhase();
    }
    beginPhase() {
      this.x += this.addedX;
      this.y += this.addedY;
      this.time = 0;
      this.targetTime = (opts.baseTime + opts.addedTime * Math.random()) | 0;

      this.rad += baseRad * (Math.random() < 0.5 ? 1 : -1);
      this.addedX = Math.cos(this.rad);
      this.addedY = Math.sin(this.rad);

      if (
        Math.random() < opts.dieChance ||
        this.x > dieX ||
        this.x < -dieX ||
        this.y > dieY ||
        this.y < -dieY
      ) {
        this.reset();
      }
    }
    step() {
      ++this.time;
      ++this.cumulativeTime;

      if (this.time >= this.targetTime) {
        this.beginPhase();
      }

      var prop = this.time / this.targetTime,
        wave = Math.sin((prop * Math.PI) / 2),
        x = this.addedX * wave,
        y = this.addedY * wave;

      this.context.shadowBlur = prop * opts.shadowToTimePropMult;
      this.context.fillStyle = this.context.shadowColor = this.color.replace(
        "light",
        opts.baseLight +
          opts.addedLight *
            Math.sin(this.cumulativeTime * this.lightInputMultiplier)
      );
      this.context.fillRect(
        opts.cx + (this.x + x) * opts.len,
        opts.cy + (this.y + y) * opts.len,
        5,
        5
      );

      if (Math.random() < opts.sparkChance) {
        this.context.fillRect(
          opts.cx +
            (this.x + x) * opts.len +
            Math.random() * opts.sparkDist * (Math.random() < 0.5 ? 1 : -1) -
            opts.sparkSize / 2,
          opts.cy +
            (this.y + y) * opts.len +
            Math.random() * opts.sparkDist * (Math.random() < 0.5 ? 1 : -1) -
            opts.sparkSize / 2,
          opts.sparkSize,
          opts.sparkSize
        );
      }
    }
  }

  let lines = [];

  const loop = (context, width, height) => {
    tick++;

    context.globalCompositeOperation = "source-over";
    context.shadowBlur = 0;
    context.fillStyle = `rgba(0,0,0,${opts.repaintAlpha})`;
    context.fillRect(0, 0, width, height);
    context.globalCompositeOperation = "lighter";

    if (lines.length < opts.count && Math.random() < opts.spawnChance) {
      lines.push(new Line(context));
    }
    lines.map((line) => {
      line.step();
    });
  };

  return ({ context, width, height }) => {
    loop(context, width, height);
  };
};

canvasSketch(sketch, settings);
