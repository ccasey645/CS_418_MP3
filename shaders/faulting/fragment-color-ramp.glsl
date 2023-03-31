#version 300 es
precision highp float;
uniform vec4 color;
out vec4 fragColor;
in vec3 outnormal;
in float outheight;
uniform vec3 lightdir;
uniform vec3 lightcolor;
uniform vec3 halfway;
uniform float maxHeight;
uniform float minHeight;


void main() {
    float r = min(outheight / maxHeight, 1.0);
    float g = min(cos(outheight / minHeight), 1.0);
    float b = min(sin(outheight / minHeight), 1.0);
    vec3 normal = normalize(outnormal);
    float blinn = pow(max(dot(halfway, normal), 0.0), 150.0);
    float lambert = max(0.0, dot(lightdir, normal));
    fragColor = vec4(
            vec3(r, g, b) * (lambert * lightcolor) + lightcolor * blinn,
        1.0);
}