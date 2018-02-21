#ifdef GL_ES
precision mediump float;
#endif
#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
#pragma glslify: cnoise3 = require(glsl-noise/classic/3d)
#pragma glslify: pnoise3 = require(glsl-noise/periodic/3d)


uniform sampler2D tDiffuse;
varying vec2 vUv;
varying vec3 pos;


void main() {
   // vec2 uv = gl_FragCoord.xy / resolution.xy;
   vec4 color = texture2D( tDiffuse, vUv );
   float noise = snoise3(pos * 103.);
   gl_FragColor = vec4(vec3(noise),1.0);
//    gl_FragColor = vec4( color.rgb , color.a );
//    gl_FragColor.r = texture2D( tDiffuse, vUv + vec2(0.1,0.0)).r;
//    gl_FragColor.g = texture2D( tDiffuse, vUv - vec2(0.1,0.0)).g;
}