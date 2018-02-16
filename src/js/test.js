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

    // テクスチャにGPUで計算するために初期情報を埋めていく
    this.fillTextures(dtPosition, dtVelocity);

    // shaderプログラムのアタッチ
    this.velocityVariable = gpuCompute.addVariable("textureVelocity", velocityShader, dtVelocity);
    this.positionVariable = gpuCompute.addVariable("texturePosition", positionShader, dtPosition);

    // 一連の関係性を構築するためのおまじない
    gpuCompute.setVariableDependencies(this.velocityVariable, [this.positionVariable, this.velocityVariable]);
    gpuCompute.setVariableDependencies(this.positionVariable, [this.positionVariable, this.velocityVariable]);

    initPosition();
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


  // ②パーティクルそのものの情報を決めていく。
  initPosition() {

    // 最終的に計算された結果を反映するためのオブジェクト。
    // 位置情報はShader側(texturePosition, textureVelocity)
    // で決定されるので、以下のように適当にうめちゃってOK

    geometry = new THREE.BufferGeometry();
    var positions = new Float32Array(PARTICLES * 3);
    var p = 0;
    for (var i = 0; i < PARTICLES; i++) {
      positions[p++] = 0;
      positions[p++] = 0;
      positions[p++] = 0;
    }

    // uv情報の決定。テクスチャから情報を取り出すときに必要
    var uvs = new Float32Array(PARTICLES * 2);
    p = 0;
    for (var j = 0; j < WIDTH; j++) {
      for (var i = 0; i < WIDTH; i++) {
        uvs[p++] = i / (WIDTH - 1);
        uvs[p++] = j / (WIDTH - 1);
      }
    }

    // attributeをgeometryに登録する
    geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.addAttribute('uv', new THREE.BufferAttribute(uvs, 2));


    // uniform変数をオブジェクトで定義
    // 今回はカメラをマウスでいじれるように、計算に必要な情報もわたす。
    particleUniforms = {
      texturePosition: { value: null },
      textureVelocity: { value: null },
      cameraConstant: { value: getCameraConstant(camera) }
    };



    // Shaderマテリアル これはパーティクルそのものの描写に必要なシェーダー
    var material = new THREE.ShaderMaterial({
      uniforms: particleUniforms,
      vertexShader: document.getElementById('particleVertexShader').textContent,
      fragmentShader: document.getElementById('particleFragmentShader').textContent
    });
    material.extensions.drawBuffers = true;
    var particles = new THREE.Points(geometry, material);
    particles.matrixAutoUpdate = false;
    particles.updateMatrix();

    // パーティクルをシーンに追加
    scene.add(particles);
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