#include './perlin-noise.glsl';

float BIG_WAVES_ELEVATION = 0.05;
vec2 BIG_WAVES_FREQUENCY = vec2(3.0, 5.5);
float BIG_WAVES_SPEED = 0.75;

float SMALL_WAVES_ELEVATION = 0.15;
float SMALL_WAVES_FREQUENCY = 3.0;
float SMALL_WAVES_SPEED = 0.2;
float SMALL_WAVES_ITERATIONS = 1.0;

float getWaveElevation(
    vec4 position,
    float time
) {
    float elevation = sin(position.x * BIG_WAVES_FREQUENCY.x + time * BIG_WAVES_SPEED)
        * sin(position.z * BIG_WAVES_FREQUENCY.y + time * BIG_WAVES_SPEED)
        * BIG_WAVES_ELEVATION;
    
    for (float i = 1.0; i <= SMALL_WAVES_ITERATIONS; i++) {
        elevation -= abs(
            cnoise(
                vec3(position.xz * SMALL_WAVES_FREQUENCY, time * SMALL_WAVES_SPEED) * SMALL_WAVES_ELEVATION / i
            )
        );
    }

    return elevation;
}
