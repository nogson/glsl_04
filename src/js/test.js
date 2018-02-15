const hmr = require('../../lib/three-hmr')
const cache = hmr.cache(__filename)
const glslify = require('glslify')

const velocityShader = glslify('./shaders/velocityShader.vert')
const positionShader = glslify('./shaders/positionShader.vert')

const width = window.innerWidth;
const height = window.innerHeight;

let dtPosition;
let dtVelocity;

module.exports = class Test {
  constructor(renderer) {
    const gpuCompute = new GPUComputationRenderer(width, height, renderer);

    //位置情報用のテクスチャ
    dtPosition = gpuCompute.createTexture();
    //移動方向用のテクスチャ
    dtVelocity = gpuCompute.createTexture();
    console.log(dtPosition)
    // テクスチャにGPUで計算するために初期情報を埋めていく
    this.fillTextures(dtPosition, dtVelocity);

    // shaderプログラムのアタッチ
    this.velocityVariable = gpuCompute.addVariable("textureVelocity", velocityShader, dtVelocity);
    this.positionVariable = gpuCompute.addVariable("texturePosition", positionShader, dtPosition);
  }

  create() {

    var side = 32;

    var amount = Math.pow(side, 2);
    var data = new Uint8Array(amount);
    console.log(data)
    for (var i = 0; i < amount; i++) {
      data[i] = Math.random() * 256;
    }
    
    var dataTex = new THREE.DataTexture(data, side, side, THREE.LuminanceFormat, THREE.UnsignedByteType);

    dataTex.magFilter = THREE.NearestFilter;
    dataTex.needsUpdate = true;

    /*Plane*/
    var planeGeo = new THREE.PlaneBufferGeometry(1, 1);
    var planeMat = new THREE.MeshBasicMaterial({ color: 0x4422ff, alphaMap: dataTex, transparent: true,side:THREE.DoubleSide });
    var plane = new THREE.Mesh(planeGeo, planeMat);

    return plane;


    // const geometry = new THREE.SphereBufferGeometry(1, 32, 32);
    // const material = new THREE.MeshBasicMaterial({
    //   color: 0xffffff,
    //   wireframe: true
    // });
    // const mesh = new THREE.Mesh(geometry, material);

    // return mesh;
  }

  //テクスチャの初期情報を設定
  fillTextures(texturePosition, textureVelocity) {

    // textureのイメージデータをいったん取り出す
    var posArray = texturePosition.image.data;
    var velArray = textureVelocity.image.data;

    // パーティクルの初期の位置は、ランダムなXZに平面おく。
    // 板状の正方形が描かれる

    for (var k = 0, kl = posArray.length; k < kl; k += 4) {
      // Position
      var x, y, z;
      x = Math.random() * 500 - 250;
      z = Math.random() * 500 - 250;
      y = 0;
      // posArrayの実態は一次元配列なので
      // x,y,z,wの順番に埋めていく。
      // wは今回は使用しないが、配列の順番などを埋めておくといろいろ使えて便利
      posArray[k + 0] = x;
      posArray[k + 1] = y;
      posArray[k + 2] = z;
      posArray[k + 3] = 0;

      // 移動する方向はとりあえずランダムに決めてみる。
      // これでランダムな方向にとぶパーティクルが出来上がるはず。
      velArray[k + 0] = Math.random() * 2 - 1;
      velArray[k + 1] = Math.random() * 2 - 1;
      velArray[k + 2] = Math.random() * 2 - 1;
      velArray[k + 3] = Math.random() * 2 - 1;
    }
  }


};

if (module.hot) {
  module.hot.accept(err => {
    if (err) throw errr
  })
  hmr.update(cache, {
    velocityShader,
    // fragmentShader
  })
}