#include './crater-noise.glsl';

const float INTENSITY = 0.01;
const float FREQUENCY = 0.5;
const float LACUNARITY = 2.0;
const float PERSISTENCE = 0.5;
const float SCALE = 0.1;
const float OFFSET = 0.0;

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}