varying float vRandom;

uniform vec3 uColorA;
uniform vec3 uColorB;

void main() {
    vec3 color = mix(uColorA, uColorB, vRandom);

    float alpha = 1.0;

    gl_FragColor = vec4(color, alpha);
}