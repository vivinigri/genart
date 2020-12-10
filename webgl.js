// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three")

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls")

const canvasSketch = require("canvas-sketch")
const random = require("canvas-sketch-util/random")
const palettes = require("nice-color-palettes")
const eases = require("eases")
const BezierEasing = require("bezier-easing")

/**
 * EXPORT GIF (frames to tmp folder)
 *
 * run
 * canvas-sketch file.js --output=tmp/
 * Ctrl + Shift + S
 *
 * use ffmpeg to convert to mp4
 * or GIFTOOL
 *
 * cubic-bezier.com
 */

const settings = {
  dimensions: [512, 512],
  fps: 24,
  duration: 4,
  animate: true,
  context: "webgl",
  attributes: { antialias: true },
}

const sketch = ({ context }) => {
  const palette = random.pick(palettes)
  const easeFn = BezierEasing(0.67, 0.03, 0.29, 0.99)
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas,
  })

  // WebGL background color
  renderer.setClearColor("hsl(180, 18%, 72%)", 1)

  // Setup a camera
  const camera = new THREE.OrthographicCamera()
  // const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 100);
  camera.position.set(1, 1, 1)
  camera.lookAt(new THREE.Vector3())

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas)

  // Setup your scene
  const scene = new THREE.Scene()

  // Setup a geometry
  // const geometry = new THREE.SphereGeometry(1, 12, 2)
  const geometry = new THREE.BoxGeometry(1, 1, 1)

  // Setup a material
  /* const material = new THREE.MeshBasicMaterial({
    color: random.pick(palette),
    // wireframe: true,
    flatShading: true,
  }) */

  // Setup a mesh with geometry + material
  for (let i = 0; i < 100; i++) {
    const mesh = new THREE.Mesh(
      geometry,
      // new THREE.MeshBasicMaterial({
      new THREE.MeshStandardMaterial({
        color: random.pick(palette),
        // wireframe: true,
        flatShading: true,
      })
    )
    mesh.position.set(
      random.range(-1, 1),
      random.range(-1, 1),
      random.range(-1, 1)
    )
    mesh.scale.set(
      random.range(-1, 2),
      random.range(-2, 2),
      random.range(-1, 2)
    )
    mesh.scale.multiplyScalar(0.3)
    scene.add(mesh)
  }

  const ambLight = new THREE.AmbientLight("white", 0.2)

  const light = new THREE.DirectionalLight("white", 1)
  light.position.set(0, 4, 2)
  scene.add(light)
  scene.add(ambLight)

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio)
      renderer.setSize(viewportWidth, viewportHeight, false)
      // camera.aspect = viewportWidth / viewportHeight
      const aspect = viewportWidth / viewportHeight
      // Ortho zoom
      const zoom = 2

      // Bounds
      camera.left = -zoom * aspect
      camera.right = zoom * aspect
      camera.top = zoom
      camera.bottom = -zoom

      // Near/Far
      camera.near = -100
      camera.far = 100

      // Set position & look at world center
      camera.position.set(zoom, zoom, zoom)
      camera.lookAt(new THREE.Vector3())

      camera.updateProjectionMatrix()
    },
    // Update & render your scene here
    render({ time, playhead }) {
      const t = Math.sin(playhead * Math.PI)
      scene.children.forEach((child, i) => {
        if (i % 3 === 0) {
          child.rotation.x = easeFn(t * 1)
        } else if (i % 3 === 1) {
          child.rotation.y = easeFn(t * 3)
        } else {
          child.rotation.z = easeFn(t * 2)
        }
      })
      // scene.rotation.y = easeFn(t)
      // scene.rotation.y = eases.expoInOut(t)
      // scene.rotation.y = playhead * Math.PI * 2
      // mesh.rotation.y = time * ((10 * Math.PI) / 100)
      controls.update()
      renderer.render(scene, camera)
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      controls.dispose()
      renderer.dispose()
    },
  }
}

canvasSketch(sketch, settings)
