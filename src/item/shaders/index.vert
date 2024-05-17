uniform vec2 uWalkDirection;
uniform bool uIsInFront;
uniform float uTime;

varying vec2 vUv;
varying vec3 vPosition;

const float AMPLITUDE = 0.3;

void main() {
    vUv = uv;
    vPosition = position;

    vec3 newPosition = position;
    if (uWalkDirection.x != 0.0 && !uIsInFront) {
        newPosition.y += sin(uTime * 10.0) * AMPLITUDE;
    }

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}