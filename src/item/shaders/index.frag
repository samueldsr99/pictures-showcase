uniform sampler2D uTexture;
uniform bool uIsInFront;

varying vec2 vUv;
varying vec3 vPosition;

void main() {
    if (uIsInFront) {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }

    gl_FragColor = texture2D(uTexture, vUv);
}