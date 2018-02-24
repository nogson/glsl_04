global.THREE = require('three');
const createBackground = require('three-vignette-background');
const Stats = require('stats.js');
const PostEffect = require('./src/js/posteffect.js');
const Ball = require('./src/js/ball.js');

const clock = new THREE.Clock();
const loader = new THREE.TextureLoader();

let time = 0.0;
let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;
let aspect = windowWidth / windowHeight;

const app = {
  renderer: new THREE.WebGLRenderer(),
  scene: new THREE.Scene(),
  camera: new THREE.PerspectiveCamera(60, windowWidth / windowHeight, 0.1, 1000)
};
const body = document.getElementsByTagName('body')[0];


app.renderer.setClearColor(new THREE.Color(0xffffff), 1.0);

// canvasをbodyに追加
body.appendChild(app.renderer.domElement);

// canvasをリサイズ
app.renderer.setSize(windowWidth, windowHeight);

//LIGHTS
let light = new THREE.AmbientLight(0xffffff, 1.0);
app.scene.add(light);

app.camera.position.z = 1.5;

let stats = new Stats();
body.appendChild(stats.dom);


const posteffect = new PostEffect(app);
const composer = posteffect.getComposer();

render();


function render() {
  time = clock.getElapsedTime();
  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;

  stats.update();
  composer.render();
  composer.passes[1].uniforms.time.value = time;
  requestAnimationFrame(render);
}

