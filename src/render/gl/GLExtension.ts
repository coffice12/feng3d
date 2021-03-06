namespace feng3d
{
    /**
     * GL扩展
     */
    export class GLExtension
    {
        aNGLEInstancedArrays: ANGLE_instanced_arrays;
        eXTBlendMinMax: EXT_blend_minmax;
        eXTColorBufferHalfFloat: any;
        eXTFragDepth: EXT_frag_depth;
        eXTsRGB: EXT_sRGB;
        eXTShaderTextureLOD: EXT_shader_texture_lod;
        eXTTextureFilterAnisotropic: EXT_texture_filter_anisotropic;
        oESElementIndexUint: OES_element_index_uint;
        oESStandardDerivatives: OES_standard_derivatives;
        oESTextureFloat: OES_texture_float;
        oESTextureFloatLinear: OES_texture_float_linear;
        oESTextureHalfFloat: OES_texture_half_float;
        oESTextureHalfFloatLinear: OES_texture_half_float_linear;
        oESVertexArrayObject: OES_vertex_array_object;
        webGLColorBufferFloat: WEBGL_color_buffer_float;
        webGLCompressedTextureATC: any;
        webGLCompressedTextureETC1: any;
        webGLCompressedTexturePVRTC: any;
        webGLCompressedTextureS3TC: WEBGL_compressed_texture_s3tc;
        webGLDebugRendererInfo: WEBGL_debug_renderer_info;
        webGLDebugShaders: WEBGL_debug_shaders;
        webGLDepthTexture: WEBGL_depth_texture;
        webGLDrawBuffers: WEBGL_draw_buffers;
        webGLLoseContext: any;

        constructor(gl: GL)
        {
            debuger && console.assert(!gl.extensions, `${gl} ${gl.extensions} 存在！`);
            gl.extensions = this;

            this.initExtensions(gl);

            this.cacheGLQuery(gl);
        }

        private initExtensions(gl: feng3d.GL)
        {
            this.aNGLEInstancedArrays = gl.getExtension("ANGLE_instanced_arrays");
            this.eXTBlendMinMax = gl.getExtension("EXT_blend_minmax");
            this.eXTColorBufferHalfFloat = gl.getExtension("EXT_color_buffer_half_float");
            this.eXTFragDepth = gl.getExtension("EXT_frag_depth");
            this.eXTsRGB = gl.getExtension("EXT_sRGB");
            this.eXTShaderTextureLOD = gl.getExtension("EXT_shader_texture_lod");
            this.eXTTextureFilterAnisotropic = gl.getExtension("EXT_texture_filter_anisotropic");
            this.oESElementIndexUint = gl.getExtension("OES_element_index_uint");
            this.oESStandardDerivatives = gl.getExtension("OES_standard_derivatives");
            this.oESTextureFloat = gl.getExtension("OES_texture_float");
            this.oESTextureFloatLinear = gl.getExtension("OES_texture_float_linear");
            this.oESTextureHalfFloat = gl.getExtension("OES_texture_half_float");
            this.oESTextureHalfFloatLinear = gl.getExtension("OES_texture_half_float_linear");
            this.oESVertexArrayObject = gl.getExtension("OES_vertex_array_object");
            this.webGLColorBufferFloat = gl.getExtension("WEBGL_color_buffer_float");
            this.webGLCompressedTextureATC = gl.getExtension("WEBGL_compressed_texture_atc");
            this.webGLCompressedTextureETC1 = gl.getExtension("WEBGL_compressed_texture_etc1");
            this.webGLCompressedTexturePVRTC = gl.getExtension("WEBGL_compressed_texture_pvrtc");
            this.webGLCompressedTextureS3TC = gl.getExtension("WEBGL_compressed_texture_s3tc");
            this.webGLDebugRendererInfo = gl.getExtension("WEBGL_debug_renderer_info");
            this.webGLDebugShaders = gl.getExtension("WEBGL_debug_shaders");
            this.webGLDepthTexture = gl.getExtension("WEBGL_depth_texture");
            this.webGLDrawBuffers = gl.getExtension("WEBGL_draw_buffers");
            this.webGLLoseContext = gl.getExtension("WEBGL_lose_context");
            // Prefixed versions appearing in the wild as per September 2015
            this.eXTTextureFilterAnisotropic = this.eXTTextureFilterAnisotropic || gl.getExtension("WEBKIT_EXT_texture_filter_anisotropic");
            this.webGLCompressedTextureATC = this.webGLCompressedTextureATC || gl.getExtension("WEBKIT_WEBGL_compressed_texture_atc");
            this.webGLCompressedTexturePVRTC = this.webGLCompressedTexturePVRTC || gl.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");
            this.webGLCompressedTextureS3TC = this.webGLCompressedTextureS3TC || gl.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");
            this.webGLDepthTexture = this.webGLDepthTexture || gl.getExtension("WEBKIT_WEBGL_depth_texture");
            this.webGLLoseContext = this.webGLLoseContext || gl.getExtension("WEBKIT_WEBGL_lose_context");
            this.webGLCompressedTextureS3TC = this.webGLCompressedTextureS3TC || gl.getExtension("MOZ_WEBGL_compressed_texture_s3tc");
            this.webGLDepthTexture = this.webGLDepthTexture || gl.getExtension("MOZ_WEBGL_depth_texture");
            this.webGLLoseContext = this.webGLLoseContext || gl.getExtension("MOZ_WEBGL_lose_context");
        }

        /**
         * 缓存GL查询
         * @param gl GL实例
         */
        private cacheGLQuery(gl: GL)
        {
            var extensions = {};
            var oldGetExtension = gl.getExtension;
            gl.getExtension = function (name: string)
            {
                extensions[name] = extensions[name] || oldGetExtension.apply(gl, arguments);
                return extensions[name];
            }
            //
            var oldGetParameter = gl.getParameter;
            var parameters = {};
            gl.getParameter = function (pname: number)
            {
                parameters[pname] = parameters[pname] || oldGetParameter.apply(gl, arguments)
                return parameters[pname];
            }
        }
    }
}