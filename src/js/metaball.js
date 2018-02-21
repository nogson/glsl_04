const hmr = require('../../lib/three-hmr')
const cache = hmr.cache(__filename)
const glslify = require('glslify')
const EffectComposer = require('three-effectcomposer')(THREE);

const vertexShader = glslify('./shaders/metaball/vertexShader.vert');
const fragmentShader = glslify('./shaders/metaball/fragmentShader.frag');


let composer;

module.exports = class MeatBall {
  constructor(app) {
    console.log(app)
    composer = new EffectComposer(app.renderer);
    composer.addPass(new EffectComposer.RenderPass(app.scene, app.camera));

    var myEffect = {
      uniforms: {
          "tDiffuse": {
            type: 't',
            value: null
          }
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader
  }

    var effect = new EffectComposer.ShaderPass(myEffect)
    effect.renderToScreen = true

    composer.addPass(effect)
  }

  getComposer(){
    return composer;
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