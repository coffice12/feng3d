attribute vec3 a_position;

uniform mat4 u_modelMatrix;
uniform mat4 u_viewProjection;

attribute vec2 a_uv;

varying vec2 v_uv;

void main(void) {

    gl_Position = u_viewProjection * u_modelMatrix * vec4(a_position, 1.0);

    v_uv = a_uv;
}