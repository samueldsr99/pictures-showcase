uniform sampler2D uTexture;
uniform bool uIsInFront;

varying vec2 vUv;
varying vec3 vPosition;

void main() {
    gl_FragColor = texture2D(uTexture, vUv);
}