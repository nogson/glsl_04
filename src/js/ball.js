const hmr = require('../../lib/three-hmr')
const cache = hmr.cache(__filename)
const glslify = require('glslify')
// const EffectComposer = require('three-effectcomposer')(THREE);

// const vertexShader = glslify('./shaders/posteffect/vertexShader.vert');
// const fragmentShader = glslify('./shaders/posteffect/fragmentShader.frag');

let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;
let x = 0;
let y = 0;

// let composer;

module.exports = class Ball {
  constructor(app,x,y,z,r,speed,k) {
    this.app = app;
    this.mesh = null;
    this.x = x;
    this.y = y;
    this.z = z;
    this.k = k;
    this.r = r;
    this.speed =speed;
  }

  create() {

    let geometry = new THREE.CircleGeometry(this.r, 64);
    let material = new THREE.MeshBasicMaterial({
      color: 0x000000
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set(this.x, this.y, this.z);
    this.app.scene.add(this.mesh);
    this.update();
  }

  update() {
    //console.log(this.k )
    x += this.speed ;
    y += this.speed ;
    this.mesh.position.x = this.x + Math.sin(x * this.k) ;
    this.mesh.position.y = this.y + Math.cos(y * this.k);
    this.mesh.position.z = 0;
    requestAnimationFrame(this.update.bind(this));

  }
};