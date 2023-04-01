#version 300 es
in vec4 position;
in vec3 normal;
out float outcliff;
out vec3 outnormal;
out float outheight;
uniform mat4 p;
uniform mat4 mv;
void main() {
    gl_Position = p * mv * position;
    outnormal = normal;
    outheight = position.z;
}