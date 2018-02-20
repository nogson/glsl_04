global.THREE = require('three');
const createOrbitViewer = require('three-orbit-viewer')(THREE);
const createBackground = require('three-vignette-background');
const Stats = require('stats.js');
// const WebCam = require('./src/js/webcam.js');
// const Test = require('./src/js/test.js');
const MeataBall = require('./src/js/metaball.js');


const body = document.getElementsByTagName('body')[0];

const app = createOrbitViewer({
  clearColor: 0xffffff,
  clearAlpha: 1.0,
  fov: 45,
  near: 0.1,
  for: 1000,
  position: new THREE.Vector3(0, 0, -3)
});

//ヘルパー
const axisHelper = new THREE.AxisHelper(100);
app.scene.add(axisHelper);
// const cameraHelper = new THREE.CameraHelper( app.camera );
// app.scene.add(cameraHelper);

const bg = createBackground({
  colors: ['#fff', '#ccc'],
  noiseAlpha: 0.0
})
app.scene.add(bg);

let stats = new Stats();
body.appendChild(stats.dom);

// const webCam = new WebCam();

// webCam.getMaterial().then(function (result) {
//   const sphereGeo = new THREE.SphereGeometry(1, 64, 64)
//   const mat2 = result;
//   const sphere = new THREE.Mesh(sphereGeo, result)
//   sphere.scale.multiplyScalar(0.5)
//   app.scene.add(sphere)
// });

const meatball = new MeataBall();

meatball.setPoints();



// let angle = 0
app.on('tick', (dt) => {
  let width = window.innerWidth;
  let height = window.innerHeight;

  bg.style({
    aspect: width / height,
    aspectCorrection: true,
    scale: 2.5,
    grainScale: 0
  });



  stats.update();

})