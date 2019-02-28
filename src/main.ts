import {vec3, mat4} from 'gl-matrix';
import * as Stats from 'stats-js';
import * as DAT from 'dat-gui';
import Square from './geometry/Square';
import ScreenQuad from './geometry/ScreenQuad';
import OpenGLRenderer from './rendering/gl/OpenGLRenderer';
import Camera from './Camera';
import {setGL} from './globals';
import ShaderProgram, {Shader} from './rendering/gl/ShaderProgram';
import Plant from './plant';
import Mesh from './geometry/Mesh';
import {readTextFile} from './globals';


// Define an object with application parameters and button callbacks
// This will be referred to by dat.GUI's functions that add GUI elements.
const controls = {
  expansion: 9,
  age: 0.3,
  windIntensity: 1.0,

};

let square: Square;
let screenQuad: ScreenQuad;
let time: number = 0.0;
let plant: Plant;
let branch: Mesh;
let flower: Mesh;
let ground: Mesh;
let prevExpansion: number = 9;
let prevAge: number = 0.3;

function loadScene(expansion: number, age: number) {
  square = new Square();
  square.create();

  plant = new Plant(expansion, age);
  let obj0: string = readTextFile('./treeOBJ.obj');
  let obj1: string = readTextFile('./flowerOBJ.obj');
  let objground: string = readTextFile('./groundOBJ.obj');


  branch = new Mesh(obj0, vec3.fromValues(0, 0, 0));
  branch.create();



  flower = new Mesh(obj1, vec3.fromValues(0, 0, 0));
  flower.create();

  ground = new Mesh(objground, vec3.fromValues(0, 0, 0));
  ground.create();

  screenQuad = new ScreenQuad();
  screenQuad.create();
  plant.fillRules();

  
  // Set up instanced rendering data arrays here.
  // This example creates a set of positional
  // offsets and gradiated colors for a 100x100 grid
  // of squares, even though the VBO data for just
  // one square is actually passed to the GPU
  plant.runLsystem();

  let colorsArray = [];

  let col1sArray = [];
  let col2sArray = [];
  let col3sArray = [];
  let col4sArray = [];



  let n: number = plant.transformationMats.length;
  for(let i = 0; i < n; i++) {
      let transformation: mat4 = plant.transformationMats[i];

      col1sArray.push(transformation[0]);
      col1sArray.push(transformation[1]);
      col1sArray.push(transformation[2]);
      col1sArray.push(transformation[3]);

      col2sArray.push(transformation[4]);
      col2sArray.push(transformation[5]);
      col2sArray.push(transformation[6]);
      col2sArray.push(transformation[7]);

      col3sArray.push(transformation[8]);
      col3sArray.push(transformation[9]);
      col3sArray.push(transformation[10]);
      col3sArray.push(transformation[11]);

      col4sArray.push(transformation[12]);
      col4sArray.push(transformation[13]);
      col4sArray.push(transformation[14]);
      col4sArray.push(1);


      colorsArray.push(0.3);
      colorsArray.push(0.2);
      colorsArray.push(0.1);
      colorsArray.push(1.0); // Alpha channel
  }

  let colors: Float32Array = new Float32Array(colorsArray);
  let col1s: Float32Array = new Float32Array(col1sArray);
  let col2s: Float32Array = new Float32Array(col2sArray);
  let col3s: Float32Array = new Float32Array(col3sArray);
  let col4s: Float32Array = new Float32Array(col4sArray);

  branch.setInstanceVBOs(colors, col1s, col2s, col3s, col4s);
  branch.setNumInstances(n); // grid of "particles"


  let flowerColorsArray = [];

  let flowerCol1sArray = [];
  let flowerCol2sArray = [];
  let flowerCol3sArray = [];
  let flowerCol4sArray = [];

  let color0 = vec3.fromValues(1.0, 0.6, 1.0);
  let color1 = vec3.fromValues(0.5, 0.4, 0.1);

  color0 = vec3.multiply(color0, vec3.fromValues(1 - age, 1 - age, 1 - age), color0);
  color1 = vec3.multiply(color1, vec3.fromValues(age, age, age), color1);

  
  let colorMix = vec3.create();
  vec3.add(colorMix, color0, color1);

  let nf: number = plant.flowerMats.length;
  for(let i = 0; i < nf; i++) {
    let transformation: mat4 = plant.flowerMats[i];

    flowerCol1sArray.push(transformation[0]);
    flowerCol1sArray.push(transformation[1]);
    flowerCol1sArray.push(transformation[2]);
    flowerCol1sArray.push(transformation[3]);

    flowerCol2sArray.push(transformation[4]);
    flowerCol2sArray.push(transformation[5]);
    flowerCol2sArray.push(transformation[6]);
    flowerCol2sArray.push(transformation[7]);
    flowerCol3sArray.push(transformation[8]);
    flowerCol3sArray.push(transformation[9]);
    flowerCol3sArray.push(transformation[10]);
    flowerCol3sArray.push(transformation[11]);
    flowerCol4sArray.push(transformation[12]);
    flowerCol4sArray.push(transformation[13]);
    flowerCol4sArray.push(transformation[14]);
    flowerCol4sArray.push(1);

    flowerColorsArray.push(colorMix[0]);
    flowerColorsArray.push(colorMix[1] + (0.2 * Math.random() - 0.1));
    flowerColorsArray.push(colorMix[2]);
    flowerColorsArray.push(1.0); // Alpha channel
}

let flowerColors: Float32Array = new Float32Array(flowerColorsArray);
let flowerCol1s: Float32Array = new Float32Array(flowerCol1sArray);
let flowerCol2s: Float32Array = new Float32Array(flowerCol2sArray);
let flowerCol3s: Float32Array = new Float32Array(flowerCol3sArray);
let flowerCol4s: Float32Array = new Float32Array(flowerCol4sArray);

  flower.setInstanceVBOs(flowerColors, flowerCol1s, flowerCol2s, flowerCol3s, flowerCol4s);
  flower.setNumInstances(nf); // grid of "particles"





  let colorsArrayGround = [];

  let col1sArrayGround = [];
  let col2sArrayGround = [];
  let col3sArrayGround = [];
  let col4sArrayGround = [];



  let ng: number = 1;
  for(let i = 0; i < n; i++) {
      let transformation: mat4 = mat4.create();
      mat4.identity(transformation);

      col1sArrayGround.push(transformation[0]);
      col1sArrayGround.push(transformation[1]);
      col1sArrayGround.push(transformation[2]);
      col1sArrayGround.push(transformation[3]);

      col2sArrayGround.push(transformation[4]);
      col2sArrayGround.push(transformation[5]);
      col2sArrayGround.push(transformation[6]);
      col2sArrayGround.push(transformation[7]);

      col3sArrayGround.push(transformation[8]);
      col3sArrayGround.push(transformation[9]);
      col3sArrayGround.push(transformation[10]);
      col3sArrayGround.push(transformation[11]);

      col4sArrayGround.push(transformation[12]);
      col4sArrayGround.push(transformation[13]);
      col4sArrayGround.push(transformation[14]);
      col4sArrayGround.push(1);


      colorsArrayGround.push(0.3);
      colorsArrayGround.push(0.4);
      colorsArrayGround.push(0.2);
      colorsArrayGround.push(1.0); // Alpha channel
  }

  let groundColors: Float32Array = new Float32Array(colorsArrayGround);
  let groundCol1s: Float32Array = new Float32Array(col1sArrayGround);
  let groundCol2s: Float32Array = new Float32Array(col2sArrayGround);
  let groundCol3s: Float32Array = new Float32Array(col3sArrayGround);
  let groundCol4s: Float32Array = new Float32Array(col4sArrayGround);

  ground.setInstanceVBOs(groundColors, groundCol1s, groundCol2s, groundCol3s, groundCol4s);
  ground.setNumInstances(ng); // grid of "particles"
}

function main() {
  // Initial display for framerate
  const stats = Stats();
  stats.setMode(0);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  document.body.appendChild(stats.domElement);

  // Add controls to the gui
  const gui = new DAT.GUI();
  gui.add(controls, 'expansion', 3, 10).step(1);
  gui.add(controls, 'age', 0, 1).step(0.1);
  gui.add(controls, 'windIntensity', 0, 2).step(0.1);



  // get canvas and webgl context
  const canvas = <HTMLCanvasElement> document.getElementById('canvas');
  const gl = <WebGL2RenderingContext> canvas.getContext('webgl2');
  if (!gl) {
    alert('WebGL 2 not supported!');
  }
  // `setGL` is a function imported above which sets the value of `gl` in the `globals.ts` module.
  // Later, we can import `gl` from `globals.ts` to access it
  setGL(gl);

  // Initial call to load scene
  loadScene(controls.expansion, controls.age);

  const camera = new Camera(vec3.fromValues(100, 20, 0), vec3.fromValues(0, 45, 0));

  const renderer = new OpenGLRenderer(canvas);
  renderer.setClearColor(0.2, 0.2, 0.2, 1);
  // gl.enable(gl.BLEND);
  // gl.blendFunc(gl.ONE, gl.ONE); // Additive blending
  gl.enable(gl.DEPTH_TEST);


  const instancedShader = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/instanced-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/instanced-frag.glsl')),
  ]);

  const flat = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/flat-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/flat-frag.glsl')),
  ]);

  // This function will be called every frame
  function tick() {
    camera.update();
    stats.begin();
    instancedShader.setTime(time);
    flat.setTime(time++);
    gl.viewport(0, 0, window.innerWidth, window.innerHeight);
    renderer.clear();

    if (controls.expansion != prevExpansion || controls.age != prevAge) {
      loadScene(controls.expansion, controls.age);
      prevExpansion = controls.expansion;
      prevAge = controls.age;
    }



    renderer.render(camera, flat, controls.windIntensity, [screenQuad]);
    renderer.render(camera, instancedShader, controls.windIntensity, [
      branch, flower, ground,
    ]);
    stats.end();

    // Tell the browser to call `tick` again whenever it renders a new frame
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.setAspectRatio(window.innerWidth / window.innerHeight);
    camera.updateProjectionMatrix();
    flat.setDimensions(window.innerWidth, window.innerHeight);
  }, false);

  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.setAspectRatio(window.innerWidth / window.innerHeight);
  camera.updateProjectionMatrix();
  flat.setDimensions(window.innerWidth, window.innerHeight);

  // Start the render loop
  tick();
}

main();
