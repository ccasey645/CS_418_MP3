#version 300 es
precision highp float;
uniform vec4 color;
out vec4 fragColor;
in vec3 outnormal;
uniform vec3 lightdir;
uniform vec3 lightcolor;
uniform vec3 halfway;
uniform vec3 halfway2;
uniform vec3 lightdir2;
uniform vec3 lightcolor2;

void main() {
    vec3 normal = normalize(outnormal);
    float blinn = pow(max(dot(halfway, normal), 0.0), 50.0);
    float blinn2 = pow(max(dot(halfway2, normal), 0.0), 50.0);
    float lambert = max(0.0, dot(lightdir, normal));
    float lambert2 = max(0.0, dot(lightdir2, normal));
    fragColor = vec4(
        color.rgb * (lambert * lightcolor + lightcolor2 * lambert2) + lightcolor * blinn + lightcolor2 * blinn2,
        color.a);
}