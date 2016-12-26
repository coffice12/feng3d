module feng3d {

    /**
     * 渲染原子（该对象会收集一切渲染所需数据以及参数）
     * @author feng 2016-06-20
     */
    export class RenderAtomic {

        /**
         * 顶点索引缓冲
         */
        public indexBuffer: IndexRenderData;

        /**
         * 渲染程序名称（路径）
         */
        public shaderName: string;

        /**
         * 属性数据列表
         */
        public attributes: { [name: string]: AttributeRenderData } = {};

        /**
         * 常量数据（包含纹理）列表
         */
        public uniforms: { [name: string]: Matrix3D | Vector3D | ImageData | HTMLVideoElement | HTMLImageElement | HTMLCanvasElement; } = {};

        /**
         * 渲染参数
         */
        public shaderParams = new ShaderParams();

        /**
         * 顶点宏
         */
        public vertexMacro: VertexMacro = {};

        /**
         * 片段宏
         */
        public fragmentMacro: FragmentMacro = <any>{};

        /**
         * 绘制  
         */
        public draw(context3D: WebGLRenderingContext) {

            var shaderData = shaderMap[this.shaderName] = shaderMap[this.shaderName] || new ShaderData(this.shaderName);
            if (!shaderData.isOk)
                return;
            //应用宏
            var vertexCode = ShaderLib.applyMacro(shaderData.vertexCode, this.vertexMacro);
            var fragmentCode = ShaderLib.applyMacro(shaderData.fragmentCode, this.fragmentMacro);
            //渲染程序
            var shaderProgram = context3DPool.getWebGLProgram(context3D, vertexCode, fragmentCode);
            context3D.useProgram(shaderProgram);
            //
            activeAttributes(context3D, shaderProgram, this.attributes);
            activeUniforms(context3D, shaderProgram, this.uniforms);
            dodraw(context3D, this.shaderParams, this.indexBuffer);
        }
    }

    /**
     * 激活属性
     */
    function activeAttributes(context3D: WebGLRenderingContext, shaderProgram: WebGLProgram, attributes: { [name: string]: AttributeRenderData }) {

        var numAttributes = context3D.getProgramParameter(shaderProgram, context3D.ACTIVE_ATTRIBUTES);
        var i = 0;
        while (i < numAttributes) {
            var activeInfo = context3D.getActiveAttrib(shaderProgram, i++);
            var buffer = attributes[activeInfo.name];
            setContext3DAttribute(context3D, shaderProgram, activeInfo, buffer.data);
        }
    }

    /**
     * 激活常量
     */
    function activeUniforms(context3D: WebGLRenderingContext, shaderProgram: WebGLProgram, uniforms: { [name: string]: Matrix3D | Vector3D | ImageData | HTMLVideoElement | HTMLImageElement | HTMLCanvasElement; }) {

        var numUniforms = context3D.getProgramParameter(shaderProgram, context3D.ACTIVE_UNIFORMS);
        var i = 0;
        while (i < numUniforms) {
            var activeInfo = context3D.getActiveUniform(shaderProgram, i++);
            var data = uniforms[activeInfo.name];
            setContext3DUniform(context3D, shaderProgram, activeInfo, data);
        }
    }

    /**
     */
    function dodraw(context3D: WebGLRenderingContext, shaderParams: ShaderParams, indexBuffer: IndexRenderData) {

        var buffer = context3DPool.getIndexBuffer(context3D, indexBuffer.indices);
        context3D.bindBuffer(indexBuffer.target, buffer);
        context3D.lineWidth(1);
        context3D.drawElements(shaderParams.renderMode, indexBuffer.count, indexBuffer.type, indexBuffer.offset);
    }

    /**
     * 设置环境属性数据
     */
    function setContext3DAttribute(context3D: WebGLRenderingContext, shaderProgram: WebGLProgram, activeInfo: WebGLActiveInfo, data) {

        var location = context3D.getAttribLocation(shaderProgram, activeInfo.name);
        context3D.enableVertexAttribArray(location);
        //
        var squareVerticesBuffer = context3DPool.getVABuffer(context3D, data);
        context3D.bindBuffer(WebGLRenderingContext.ARRAY_BUFFER, squareVerticesBuffer);
        switch (activeInfo.type) {
            case WebGLRenderingContext.FLOAT_VEC3:
                context3D.vertexAttribPointer(location, 3, WebGLRenderingContext.FLOAT, false, 0, 0);
                break;
            default:
                throw `无法识别的attribute类型 ${activeInfo.name} ${data}`;
        }
    }

    /**
     * 设置环境Uniform数据
     */
    function setContext3DUniform(context3D: WebGLRenderingContext, shaderProgram: WebGLProgram, activeInfo: WebGLActiveInfo, data) {

        var location = context3D.getUniformLocation(shaderProgram, activeInfo.name);
        switch (activeInfo.type) {
            case WebGLRenderingContext.FLOAT_MAT4:
                context3D.uniformMatrix4fv(location, false, data.rawData);
                break;
            case WebGLRenderingContext.FLOAT_VEC4:
                context3D.uniform4f(location, data.x, data.y, data.z, data.w);
                break;
            case WebGLRenderingContext.SAMPLER_2D:

                var image: HTMLImageElement = data;

                var texture = context3D.createTexture();   // Create a texture object
                if (!texture) {
                    console.log('Failed to create the texture object');
                    return false;
                }

                context3D.pixelStorei(WebGLRenderingContext.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
                // Enable texture unit0
                context3D.activeTexture(WebGLRenderingContext.TEXTURE0);
                // Bind the texture object to the target
                context3D.bindTexture(WebGLRenderingContext.TEXTURE_2D, texture);

                // Set the texture parameters
                context3D.texParameteri(WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.TEXTURE_MIN_FILTER, WebGLRenderingContext.LINEAR);
                // Set the texture image
                context3D.texImage2D(WebGLRenderingContext.TEXTURE_2D, 0, WebGLRenderingContext.RGB, WebGLRenderingContext.RGB, WebGLRenderingContext.UNSIGNED_BYTE, image);

                // Set the texture unit 0 to the sampler
                context3D.uniform1i(location, 0);

                break;
            case WebGLRenderingContext.SAMPLER_CUBE:
                break;
            default:
                throw `无法识别的uniform类型 ${activeInfo.name} ${data}`;
        }
    }

    //
    var shaderMap: { [name: string]: ShaderData } = {};
}