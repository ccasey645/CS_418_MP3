#version 300 es
precision highp float;
uniform vec4 color;
out vec4 fragColor;
in vec3 outnormal;
in float outheight;
in float outcliff;
uniform vec3 lightdir;
uniform vec3 lightcolor;
uniform vec3 halfway;
uniform float maxHeight;
uniform float minHeight;
in vec3 outsurfacenormal;


void main() {
    vec3 normal = normalize(outnormal);
    vec3 surfacenormal = normalize(outsurfacenormal);
    bool cliff = surfacenormal.z < 0.9;
    float shinyness = cliff ? 150.0 : 50.0;
    float r = cliff ? 0.411 : min(outheight / maxHeight, 1.0);
    float g = cliff ? 0.411 : min(cos(outheight / minHeight), 1.0);
    float b = cliff ? 0.411 : min(sin(outheight / minHeight), 1.0);
    float blinn = pow(max(dot(halfway, normal), 0.0), shinyness);
    float lambert = max(0.0, dot(lightdir, normal));
    fragColor = vec4(
            vec3(r, g, b) * (lambert * lightcolor) + lightcolor * blinn,
        1.0);
}