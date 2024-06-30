uniform float uTime;
uniform float[512] uDataArray;

varying vec2 vUv;
varying float x;
varying float y;

attribute float aVertexIndex;

void main()
{
  float index = floor(mod(aVertexIndex, 514.0));
  float strength = uDataArray[int(index)] * 0.01;
  vec3 addVector = normal * sin(strength) * 10.0;
  vec3 newPosition = position + addVector;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}


// void main()
// {

//   x = abs(position.x);
//   y = abs(position.y);

//   float floor_x = round(x);
//   float floor_y = round(y);

//   float z = sin(uDataArray[int(floor_x)] / 30.0 + uDataArray[int(floor_y)]  / 30.0);
//   gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x,position.y,z, 1.0);
// }