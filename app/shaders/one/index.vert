attribute float aRandom;
varying float vRandom;

uniform float uIntensity;

void main() {
    vec3 newPosition = position;
    newPosition.y += aRandom * uIntensity;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);

    vRandom = aRandom;
}