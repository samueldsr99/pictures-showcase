#include './utils.glsl';
#include './waves.glsl';

uniform vec2 uWalkDirection;
uniform bool uIsInFront;
uniform float uTime;

varying vec2 vUv;
varying vec3 vPosition;

const float AMPLITUDE = 0.3;
const float BREATHE_AMPLITUDE = 0.8;
const float BEND_FACTOR = 0.08;

void main() {
    vUv = uv;
    vPosition = position;

    vec3 newPosition = position;

    float d = distance(uv, uWalkDirection);
    d = 1.0 - smoothstep(0.0, 1.0, d);

    if (!uIsInFront) {
        float bendFactorX = uWalkDirection.x * 0.5;
        bendFactorX = clamp(bendFactorX, -BEND_FACTOR, BEND_FACTOR);
        newPosition.x += d * bendFactorX;

        float bendFactorY = uWalkDirection.y * 0.5;
        bendFactorY = clamp(bendFactorY, -BEND_FACTOR, BEND_FACTOR);
        newPosition.y += d * bendFactorY;
    } else {
        vec3 eye = vec3(0.0, 0.0, 0.0);
        vec3 target = vec3(uWalkDirection.xy, -1.0);
        mat3 lookAtMat = lookAtPoint(eye, target);

        vec3 newPosition = lookAtMat * newPosition;
    }

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}