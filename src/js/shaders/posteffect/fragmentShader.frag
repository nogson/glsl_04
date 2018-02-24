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

   st.y *= resolution.y/resolution.x;

    vec2 pos = st.yx * vec2(4.,2.) * 0.3 + time * 0.05;
    vec2 pos2 = st.yx * vec2(10.,5.) * 0.3 + time * 0.04;
    vec2 pos3 = st.yx * vec2(5.,10.) * 0.3 + time * 0.03;


   pos = vec2(rotate2d( snoise2(pos)) )  * 0.3;
   pos2 = vec2(rotate2d( snoise2(pos2)))* 0.3;
   pos3 = vec2(rotate2d( snoise2(pos3))) * 0.3 ;

   float r = lines(pos,0.45,0.5,20.);
   float g = lines(pos2,0.45,0.5,20.);
   float b = lines(pos3,0.45,0.5,20.);

    gl_FragColor = vec4(r , g , b,1.0) ;
}