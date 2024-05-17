uniform sampler2D uTexture;
uniform bool uIsInFront;

varying vec2 vUv;
varying vec3 vPosition;

void main() {
    if (uIsInFront) {
        float mx = -0.23;

        // Gradually fade out the texture as it gets closer to the edge
        float dist = distance(vPosition.xy, vec2(0.5, 0.5));
        float alpha = smoothstep(0.5, 0.5 + mx, dist);

        gl_FragColor = texture2D(uTexture, vUv) * alpha;
    }

    gl_FragColor = texture2D(uTexture, vUv);
}