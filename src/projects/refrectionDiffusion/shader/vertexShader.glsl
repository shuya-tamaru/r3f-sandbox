uniform float uTime;
uniform int uOctaves;
uniform float uTimeFrequency;
uniform float uAmplitude;
uniform float uFrequency;

attribute vec4 tangent; 

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 varyNormal;

// Permutation function for noise
vec3 permute(vec3 x) { 
    return mod(((x*34.0)+1.0)*x, 289.0); 
}

// Noise function
float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    vec3 u = f*f*(3.0-2.0*f);
    
    return mix(mix(mix( dot(permute(i + vec3(0,0,0)), f - vec3(0,0,0)), 
                        dot(permute(i + vec3(1,0,0)), f - vec3(1,0,0)), u.x),
                   mix( dot(permute(i + vec3(0,1,0)), f - vec3(0,1,0)), 
                        dot(permute(i + vec3(1,1,0)), f - vec3(1,1,0)), u.x), u.y),
               mix(mix( dot(permute(i + vec3(0,0,1)), f - vec3(0,0,1)), 
                        dot(permute(i + vec3(1,0,1)), f - vec3(1,0,1)), u.x),
                   mix( dot(permute(i + vec3(0,1,1)), f - vec3(0,1,1)), 
                        dot(permute(i + vec3(1,1,1)), f - vec3(1,1,1)), u.x), u.y), u.z);
}

float fractalNoise(vec3 p, int octaves) {
    float noiseValue = 0.0;
    float amplitude = uAmplitude;
    float frequency = 1.0;
    for (int i = 0; i < octaves; i++) {
        noiseValue += amplitude * noise(p * frequency);
        amplitude *= 0.5;
        frequency *= 2.0;
    }
    return noiseValue;
}


float getDisplacement(vec3 p) {
    return fractalNoise(p * uFrequency  + vec3(uTime * uTimeFrequency), uOctaves);
}

float getDisplacementEffect(float noiseValue) {
    return sin(noiseValue) * cos(noiseValue);
}

void main() {

  vec3 biTangent = cross(normal, tangent.xyz);
  float shift = 0.01;
  vec3 positionA = csm_Position + tangent.xyz * shift;
  vec3 positionB = csm_Position + biTangent * shift;

  vPosition = position;

  float displacement = getDisplacementEffect(getDisplacement(vPosition));
  float displacementA = getDisplacementEffect(getDisplacement(positionA));
  float displacementB = getDisplacementEffect( getDisplacement(positionB));

  csm_Position += normal * displacement;
  positionA += normal * displacementA;
  positionB += normal * displacementB;

  vec3 toA = normalize(positionA - csm_Position);
  vec3 toB = normalize(positionB - csm_Position);
  csm_Normal = normalize(cross(toA, toB));

  vUv = uv;
  varyNormal = csm_Normal;
}
