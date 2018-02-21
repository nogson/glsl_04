#ifdef GL_ES
precision mediump float;
#endif


uniform sampler2D tDiffuse;
varying vec2 vUv;


void main() {
   // vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec4 color = texture2D( tDiffuse, vUv );
   gl_FragColor = vec4( color.rgb , color.a );

        gl_FragColor.r = texture2D( tDiffuse, vUv + vec2(0.1,0.0)).r;
        gl_FragColor.g = texture2D( tDiffuse, vUv - vec2(0.1,0.0)).g;
}