const canvasSketch = require("canvas-sketch")
const createShader = require("canvas-sketch-util/shader")
const glsl = require("glslify")

// Setup our sketch
const settings = {
  context: "webgl",
  animate: true,
  // pixelsPerInch:300,
  // dimensions: 'A4',
}

// Your glsl code
const frag = glsl(/* glsl */ `
  precision highp float;

  uniform float time;
  uniform float aspect;
  varying vec2 vUv;

  #pragma glslify: noise = require('glsl-noise/simplex/3d');
  #pragma glslify: hsl2rgb = require('glsl-hsl2rgb');

  void main () {
    vec3 colorA = sin(time * 2.0) + vec3(0.5, 0.0, 0.5);
    vec3 colorB = vec3(0.0, 0.5, 0.5);

    vec2 center = vUv - vec2(0.5, 0.5);
    center.x *= aspect;
    float dist = length(center);
    float alpha = smoothstep(0.26, 0.25, dist);

    // float n = noise(vec3(vUv.xy * 1.0, time));
    float n = noise(vec3(center * 2.0, time*0.7));
    vec3 color = mix(colorA, colorB, vUv.x + vUv.y * sin(time));
    vec3 colorNoise = mix(colorA, colorB, n);
    vec3 hslNoise = hsl2rgb(0.6 + n * 0.2, 0.5, 0.5);
    // gl_FragColor = vec4(colorNoise, alpha); //vec4(vec3(n), alpha); //vec4(color, alpha);
    gl_FragColor = vec4(hslNoise, alpha); //vec4(vec3(n), alpha); //vec4(color, alpha);
  }
`)

/*

color - sin(time) + vec3()

vUv - vec2(0.5, 0.5) || vUv - 0.5
OPACO
rgba format (1.0 === 255)
gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);

GRADIENTE
gl_FragColor = vec4(vec3(vUv.y), 1.0);
gl_FragColor = vec4(vec3(vUv, 1.0), 1.0);

ANIMATION
vec3 color = vec3(sin(time)+ 1.0);
gl_FragColor = vec4(color, 1.0);

MASK
gl_FragColor = vec4(color, dist > 0.3 ? 0.0 : 1.0);

STEP FUNCTION
if (value > segundo value) => 1 ou 0
float alpha = step(dist, 0.25)

SMOOTHSTEP
perfect edge
(low value, high value, variante)
se varinte < low === 0, maior que high === 1, entre gradiente
float alpha = smoothstep(0.25, 0.5, dist);
*/

/* vec3 color = 0.5 + 0.5 * cos(time + vUv.xyx + vec3(0.0, 2.0, 4.0));
    gl_FragColor = vec4(color, 1.0); */

// Your sketch, which simply returns the shader
const sketch = ({ gl }) => {
  // Create the shader and return it
  return createShader({
    // bg => if false === transparent
    clearColor: "white",
    // Pass along WebGL context
    gl,
    // Specify fragment and/or vertex shader strings
    frag,
    // Specify additional uniforms to pass down to the shaders
    uniforms: {
      // Expose props from canvas-sketch
      time: ({ time }) => time,
      aspect: ({ width, height }) => width / height,
    },
  })
}

canvasSketch(sketch, settings)
