const hmr = require('../../lib/three-hmr')
const cache = hmr.cache(__filename)
const glslify = require('glslify')
const GPUComputationRenderer = require('../../lib/GPUComputationRenderer');

const velocityShader = glslify('./shaders/velocityShader.vert')
const positionShader = glslify('/lib/GPUComputationRenderer.js')

const width = window.innerWidth;
const height = window.innerHeight;

module.exports = class Test {
  constructor(renderer) {
    this.gpuCompute = new GPUComputationRenderer(width, height, renderer);

    //位置情報用のテクスチャ
    this.dtPosition = gpuCompute.createTexture();
    //移動方向用のテクスチャ
    this.dtVelocity = gpuCompute.createTexture();

    // shaderプログラムのアタッチ
    this.velocityVariable = gpuCompute.addVariable("textureVelocity", velocityShader, dtVelocity);
    this.positionVariable = gpuCompute.addVariable("texturePosition", positionShader, dtPosition);
  }

  create() {
    const geometry = new THREE.SphereBufferGeometry(1, 32, 32);
    const material = new THREE.MeshBasicMaterial({
      color: 0xcccccc,
      wireframe: true
    });
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