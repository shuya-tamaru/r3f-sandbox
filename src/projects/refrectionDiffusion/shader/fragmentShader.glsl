varying vec2 vUv;
varying vec3 varyNormal;
varying vec3 vPosition;

uniform float uOpacity;
uniform vec3 uCameraPosition;
uniform sampler2D uNoiseTexture;
uniform float uNoiseStrength; 
uniform float uMinWavelength;
uniform float uMaxWavelength;

vec3 wavelengthToRGB(float wavelength) {
    vec3 color;
    
    if(wavelength >= 380.0 && wavelength < 440.0) {
        color = vec3((440.0 - wavelength) / (440.0 - 380.0), 0.0, 1.0);
    } else if(wavelength >= 440.0 && wavelength < 490.0) {
        color = vec3(0.0, (wavelength - 440.0) / (490.0 - 440.0), 1.0);
    } else if(wavelength >= 490.0 && wavelength < 510.0) {
        color = vec3(0.0, 1.0, (510.0 - wavelength) / (510.0 - 490.0));
    } else if(wavelength >= 510.0 && wavelength < 580.0) {
        color = vec3((wavelength - 510.0) / (580.0 - 510.0), 1.0, 0.0);
    } else if(wavelength >= 580.0 && wavelength < 645.0) {
        color = vec3(1.0, (645.0 - wavelength) / (645.0 - 580.0), 0.0);
    } else if(wavelength >= 645.0 && wavelength <= 780.0) {
        color = vec3(1.0, 0.0, 0.0);
    } else {
        color = vec3(0.0);
    }

    // 波長に基づいて強度を調整
    float factor = 0.1;
    if(wavelength >= 380.0 && wavelength < 420.0) {
        factor = 0.1 + 0.9 * (wavelength - 380.0) / (420.0 - 380.0);
    } else if(wavelength >= 420.0 && wavelength <= 700.0) {
        factor = 1.0;
    } else if(wavelength > 700.0 && wavelength <= 780.0) {
        factor = 0.1 + 0.9 * (780.0 - wavelength) / (780.0 - 700.0);
    }

    color *= factor;

    return color;
}

vec3 applyGammaCorrection(vec3 color, float gamma) {
    return pow(color, vec3(1.0 / gamma));
}


void main() {
  //directional light effect
  vec3 viewDir = normalize(uCameraPosition - vPosition);
  float dotProduct = dot(normalize(varyNormal), viewDir);
  float wavelength = mix(uMinWavelength, uMaxWavelength, abs(dotProduct));
  vec3 baseColor = mix(vec3(1.0), wavelengthToRGB(clamp(wavelength, uMinWavelength, uMaxWavelength)), 1.0 - abs(dotProduct));

  //noise effect
  vec2 repeatUv = fract(vUv * uNoiseStrength);
  float noiseValue = texture(uNoiseTexture, repeatUv).r;

  // //combine effects
  wavelength += noiseValue;
  baseColor = mix(baseColor, wavelengthToRGB(clamp(wavelength, uMinWavelength, uMaxWavelength)), noiseValue);
  baseColor = applyGammaCorrection(baseColor, 2.2);


  csm_DiffuseColor.rgb = vec3(baseColor);
  csm_DiffuseColor.a = uOpacity;

  csm_Roughness = .0;
  csm_Metalness = 1.0;
}