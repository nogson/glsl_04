#ifdef GL_ES
precision mediump float;
#endif
#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
#pragma glslify: cnoise3 = require(glsl-noise/classic/3d)
#pragma glslify: pnoise3 = require(glsl-noise/periodic/3d)


uniform sampler2D tDiffuse;
uniform vec2 resolution;
uniform float time;
varying vec2 vUv;
varying vec3 pos;

mat2 rotate2d(float angle){
    return mat2(cos(angle),-sin(angle),sin(angle),cos(angle));
}

float lines(in vec2 pos, float a,float b,float scale){
    pos *= scale;
    return smoothstep(a,b,abs((sin(pos.x*3.1415)+b*2.0)));
}


void main() {
   vec2 st = gl_FragCoord.xy/resolution.xy;

   //st.y *= resolution.y/resolution.x;

    vec2 pos = st.yx * vec2(2.,1.5) * 0.5 + time * 0.05;

   pos = vec2(rotate2d( snoise2(pos) )) * 0.3;

    float pattern = lines(pos,0.0,0.5,7.) * 0.01;

   vec4 color = texture2D( tDiffuse, vec2(vUv.x + pattern, vUv.y + pattern));

   gl_FragColor = vec4(vec3(pattern) + vec3(0.,0.7,1.0),1.0);

    gl_FragColor = color;

}