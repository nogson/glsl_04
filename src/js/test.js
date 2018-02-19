const hmr = require('../../lib/three-hmr')
const cache = hmr.cache(__filename)
const glslify = require('glslify')

const computeShaderVelocity = glslify('./shaders/computeShaderVelocity.frag');
const computeShaderPosition = glslify('./shaders/computeShaderPosition.frag');
const particleVertexShader = glslify('./shaders/particleVertexShader.vert');
const particleFragmentShader = glslify('./shaders/particleFragmentShader.frag');

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
var PARTICLES = WIDTH * HEIGHT;


let dtPosition;
let dtVelocity;
let camera;
let scene;

module.exports = class Test {
  constructor(app) {
    const gpuCompute = new GPUComputationRenderer(WIDTH, HEIGHT, app.renderer);
    camera = app.camera;
    scene = app.scene;
    //位置情報用のテクスチャ
    dtPosition = gpuCompute.createTexture();
    //移動方向用のテクスチャ
    dtVelocity = gpuCompute.createTexture();

    // テクスチャにGPUで計算するために初期情報を埋めていく
    this.fillTextures(dtPosition, dtVelocity);

    // shaderプログラムのアタッチ
    this.velocityVariable = gpuCompute.addVariable("textureVelocity", computeShaderVelocity, dtVelocity);
    this.positionVariable = gpuCompute.addVariable("texturePosition", computeShaderPosition, dtPosition);

    // 一連の関係性を構築するためのおまじない
    gpuCompute.setVariableDependencies(this.velocityVariable, [this.positionVariable, this.velocityVariable]);
    gpuCompute.setVariableDependencies(this.positionVariable, [this.positionVariable, this.velocityVariable]);

    this.initPosition();
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

    console.log('ok')

    // 最終的に計算された結果を反映するためのオブジェクト。
    // 位置情報はShader側(texturePosition, textureVelocity)
    // で決定されるので、以下のように適当にうめちゃってOK

    var geometry = new THREE.BufferGeometry();
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
    var particleUniforms = {
      texturePosition: {
        value: null
      },
      textureVelocity: {
        value: null
      },
      cameraConstant: {
        value: this.getCameraConstant(camera)
      }
    };



    // Shaderマテリアル これはパーティクルそのものの描写に必要なシェーダー
    var material = new THREE.ShaderMaterial({
      uniforms: particleUniforms,
      vertexShader: particleVertexShader,
      fragmentShader: particleFragmentShader
    });

    console.log(material)
    //material.extensions.drawBuffers = true;
    var particles = new THREE.Points(geometry, material);
    particles.matrixAutoUpdate = false;
    particles.updateMatrix();

    // パーティクルをシーンに追加
    scene.add(particles);
  }

  // カメラオブジェクトからシェーダーに渡したい情報を引っ張ってくる関数
  // カメラからパーティクルがどれだけ離れてるかを計算し、パーティクルの大きさを決定するため。
  getCameraConstant(camera) {
    return window.innerHeight / (Math.tan(THREE.Math.DEG2RAD * 0.5 * camera.fov) / camera.zoom);
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
    computeShaderPosition,
    computeShaderVelocity
  })
}