varying vec3 vPosition;
varying float vElevation;

float COLOR_OFFSET = 0.18;
float COLOR_MULTIPLIER = 2.0;
vec3 DEPTH_COLOR = vec3(0.3, 0.4, 0.76);
vec3 SURFACE_COLOR = vec3(0.6, 0.85, 1.0);

void main() {
    float mixStrength = (vElevation + COLOR_OFFSET) * COLOR_MULTIPLIER;
    vec3 color = mix(DEPTH_COLOR, SURFACE_COLOR, mixStrength);
    gl_FragColor = vec4(color, 1.0);
}
