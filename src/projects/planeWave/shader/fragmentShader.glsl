varying vec2 vUv;
varying float vWobble;

uniform vec3 uColorA;
uniform vec3 uColorB;

void main() {
  float colorMix = smoothstep(-1.0, 1.0, vWobble);
  csm_DiffuseColor.rgb = mix(uColorA, uColorB, colorMix);

  // csm_Metalness = step(0.8, vWobble);
  csm_Roughness = step(0.1, vWobble);

  csm_Roughness = 1.0 - colorMix;
}