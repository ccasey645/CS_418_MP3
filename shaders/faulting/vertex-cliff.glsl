#version 300 es
in vec4 position;
in vec3 normal;
out float outcliff;
out vec3 outnormal;
out vec3 outsurfacenormal;
out float outheight;
uniform mat4 p;
uniform mat4 mv;
void main() {
    gl_Position = p * mv * position;
    outnormal = mat3(mv) * normal;
    outsurfacenormal = normal;
    outheight = position.z;
}