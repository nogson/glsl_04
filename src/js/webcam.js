const hmr = require('../../lib/three-hmr')
const cache = hmr.cache(__filename)
const glslify = require('glslify')

const vertexShader = glslify('./shaders/vertexShader.vert')
const fragmentShader = glslify('./shaders/fragmentShader.frag')

module.exports = class WebCam {
  constructor() {
    this.material = null;

    this.media = navigator.mediaDevices.getUserMedia({
      //audio: true,
      video: true,
    });

    this.video = document.querySelector('video');
  }

  setup() {
    let promise = new Promise((resolve, reject) => {
      this.media.then((stream) => {
        this.video.src = window.URL.createObjectURL(stream);
        this.video.onloadedmetadata =  (e) => {

          let videoTexture = new THREE.Texture(video);
          videoTexture.minFilter = THREE.LinearFilter;
          videoTexture.magFilter = THREE.LinearFilter;
          videoTexture.format = THREE.RGBFormat;
          videoTexture.needsUpdate = true;

          this.material = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: {
              'videoTexture': {
                type:'t',
                  value: videoTexture
              }
          },
          });

          resolve();
        };
      });
    });

    this.media.catch(function (e) {
      console.log(e.name);
    });

    return promise;
  }

  getMaterial() {
    let promise = new Promise((resolve) => {
      this.setup().then( () => {
        resolve(this.material);
      });
    });

    return promise;
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