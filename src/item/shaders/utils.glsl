float bend(float position, vec2 uv, float offsetX, float offsetY, float bendFactor) {
    float d = distance(uv, vec2(0.2));
    d = 1.0 - smoothstep(0.0, 1.0, d);

    return position + d * bendFactor;
}

vec3 withBend(vec3 position, vec2 uv, float offsetX, float offsetY, float bendFactor) {
    vec3 newPosition = position;
    newPosition.x = bend(newPosition.x, uv, offsetX, offsetY, bendFactor);
    newPosition.y = bend(newPosition.y, uv, offsetX, offsetY, bendFactor);

    return newPosition;
}

vec3 rotateY(vec3 position, float angle) {
    float s = sin(angle);
    float c = cos(angle);

    mat3 rotationMatrix = mat3(
        c, 0, s,
        0, 1, 0,
        -s, 0, c
    );

    return rotationMatrix * position;
}

vec3 rotateZ(vec3 position, float angle) {
    float s = sin(angle);
    float c = cos(angle);

    mat3 rotationMatrix = mat3(
        c, -s, 0,
        s, c, 0,
        0, 0, 1
    );

    return rotationMatrix * position;
}

// Rotation matrix function
mat3 rotationMatrix(vec3 axis, float angle) {
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;

    return mat3(
        oc * axis.x * axis.x + c,
        oc * axis.x * axis.y - axis.z * s,
        oc * axis.z * axis.x + axis.y * s,

        oc * axis.x * axis.y + axis.z * s,
        oc * axis.y * axis.y + c,
        oc * axis.y * axis.z - axis.x * s,

        oc * axis.z * axis.x - axis.y * s,
        oc * axis.y * axis.z + axis.x * s,
        oc * axis.z * axis.z + c
    );
}

// Slightly move the y position of the vertex based on the time
vec3 breathe(vec3 position, float time, float period, float amplitude) {
    float y = position.y + sin(time * 2.0 * 3.14159 / period) * amplitude;
    return vec3(position.x, y, position.z);
}

mat3 lookAtPoint(vec3 eye, vec3 at) {
	vec3 localUp = vec3(0, 1, 0);
	vec3 fwd = normalize(at - eye);
	vec3 right = normalize(cross(localUp, fwd));
	vec3 up = normalize(cross(fwd, right));

	return mat3(right, up, fwd);
}