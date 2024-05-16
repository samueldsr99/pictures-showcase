attribute float aRandom;

uniform sampler2D uTexture;

varying vec2 vUv;
varying float vHeight;

float AMPLITUDE = 0.06;
float FREQUENCY = 8.5;

void main() {
    vUv = uv;

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // ground floor irregularity
    modelPosition.y += sin(modelPosition.x * FREQUENCY + aRandom) * AMPLITUDE;

    float BOUNDS_DEVIATION = aRandom * 0.1;

    modelPosition.x += sin(modelPosition.y * FREQUENCY) * BOUNDS_DEVIATION;
    modelPosition.z += cos(modelPosition.y * FREQUENCY) * BOUNDS_DEVIATION;

    if (modelPosition.z < -40.0) {
        modelPosition.y -= 10.0;
    }

    vHeight = modelPosition.y;

    vec4 viewPosition = viewMatrix * modelPosition;

    gl_Position = projectionMatrix * viewPosition;
}