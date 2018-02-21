#ifdef GL_ES
precision mediump float;
#endif


uniform sampler2D textuer;
varying vec2 vUv;


void main() {
   // vec2 uv = gl_FragCoord.xy / resolution.xy;

   gl_FragColor = texture2D(textuer, vUv);
}