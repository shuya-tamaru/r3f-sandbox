uniform sampler2D tDiffuse;
uniform vec4 resolution;

varying vec2 vUv;

void main(){
  vec4 color = texture2D(tDiffuse, vUv);
  gl_FragColor = color * 0.3;
}