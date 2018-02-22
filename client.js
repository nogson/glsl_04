global.THREE = require('three');
const createBackground = require('three-vignette-background');
const Stats = require('stats.js');
// const WebCam = require('./src/js/webcam.js');
// const Test = require('./src/js/test.js');
const MeataBall = require('./src/js/metaball.js');

let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;

const app = {
  renderer : new THREE.WebGLRenderer(),
  scene : new THREE.Scene(),
  camera : new THREE.PerspectiveCamera(60, windowWidth / windowHeight, 0.1, 1000)
};
const body = document.getElementsByTagName('body')[0];


app.renderer.setClearColor(new THREE.Color(0xffffff), 1.0);

// canvasをbodyに追加
body.appendChild(app.renderer.domElement);

// canvasをリサイズ
app.renderer.setSize(windowWidth, windowHeight);

//LIGHTS
// let light = new THREE.AmbientLight(0xffffff, 1.0);
// app.scene.add(light);

app.camera.position.z = 1.5;

//ヘルパー
const axisHelper = new THREE.AxisHelper(100);
app.scene.add(axisHelper);
// const cameraHelper = new THREE.CameraHelper( app.camera );
// app.scene.add(cameraHelper);

// const bg = createBackground({
//   colors: ['#fff', '#ccc'],
//   noiseAlpha: 0.0
// })
// app.scene.add(bg);

let stats = new Stats();
body.appendChild(stats.dom);

var material = new THREE.MeshLambertMaterial({color:0x000000});
var geometry = new THREE.SphereGeometry(0.5, 20, 20);
var mesh = new THREE.Mesh(geometry, material);
app.scene.add(mesh);

// const webCam = new WebCam();

// webCam.getMaterial().then(function (result) {
//   const sphereGeo = new THREE.SphereGeometry(1, 64, 64)
//   const mat2 = result;
//   const sphere = new THREE.Mesh(sphereGeo, result)
//   sphere.scale.multiplyScalar(0.5)
//   app.scene.add(sphere)
// });

const meatball = new MeataBall(app);

const composer = meatball.getComposer();


render();

function render() {

  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;

  stats.update();

  composer.render();

  requestAnimationFrame(render);
}

