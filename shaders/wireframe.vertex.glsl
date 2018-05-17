precision mediump float;  

attribute vec3 a_position;
attribute vec4 a_color;

uniform mat4 u_modelMatrix;
uniform mat4 u_viewProjection;

#ifdef HAS_SKELETON_ANIMATION
    #include<skeleton.vertex>
#endif

#ifdef HAS_PARTICLE_ANIMATOR
    #include<particle.vertex>
#endif

void main(void) {

    vec4 position = vec4(a_position,1.0);

    #ifdef HAS_SKELETON_ANIMATION
        position = skeletonAnimation(position);
    #endif

    #ifdef HAS_PARTICLE_ANIMATOR
        position = particleAnimation(position);
    #endif

    gl_Position = u_viewProjection * u_modelMatrix * position;
}