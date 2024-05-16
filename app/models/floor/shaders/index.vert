attribute float aRandom;

uniform sampler2D uTexture;
uniform float uTime;

varying vec2 vUv;

void main() {
    vUv = uv;

    vec3 newPosition = position;

    newPosition.y += sin(newPosition.x * 0.1 + aRandom * 0.1) * 10.0;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}