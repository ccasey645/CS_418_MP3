#version 300 es
precision highp float;
uniform vec4 color;
out vec4 fragColor;
in vec3 outnormal;
uniform vec3 lightdir;
uniform vec3 lightcolor;

void main() {
    vec3 normal = normalize(outnormal);
    float lambert = max(0.0, dot(lightdir, normal));
    fragColor = vec4(
        color.rgb * (lambert * lightcolor),
        color.a);
}