const hmr = require('../../lib/three-hmr')
const cache = hmr.cache(__filename)
const glslify = require('glslify')

const vertexShader = glslify('./shaders/noise.vert')
const fragmentShader = glslify('./shaders/noise.frag')

module.exports = class Test {
  constructor() {

  }

  create() {
    const geometry = new THREE.SphereBufferGeometry(1, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xcccccc,wireframe:true });
    const mesh = new THREE.Mesh(geometry, material);

    return mesh;
  }

};

if (module.hot) {
  module.hot.accept(err => {
    if (err) throw errr
  })
  hmr.update(cache, {
    vertexShader,
    fragmentShader
  })
}