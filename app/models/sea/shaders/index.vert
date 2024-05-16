#include './perlin-noise.glsl';
#include './waves.glsl';

uniform float uTime;

varying vec3 vPosition;
varying float vElevation;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    float elevation = getWaveElevation(modelPosition, uTime);

    vPosition = position;
    vElevation = elevation;

    modelPosition.y += elevation;
    modelPosition.x += 8.6 * elevation;
    modelPosition.z += 8.9 * elevation;

    gl_Position = projectionMatrix * viewMatrix * modelPosition;
}