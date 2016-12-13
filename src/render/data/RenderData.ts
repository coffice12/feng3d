module feng3d {

    /**
     * 3D对象渲染数据
     * @author feng 2016-06-20
     */
    export class RenderData {

        object3D: Object3D

        /**
         * 顶点索引缓冲
         */
        indexBuffer: IndexRenderData;

        /**
         * 渲染程序缓存
         */
        programBuffer: ProgramRenderData;

        /**
         * 属性数据列表
         */
        attributes: { [name: string]: { type: string, buffer?: AttributeRenderData } };

        /**
         * 常量数据列表
         */
        uniforms: { [name: string]: { type: string, buffer?: UniformRenderData } };

        /**
         * 渲染模式
         */
        renderMode = RenderMode.TRIANGLES;

        /**
         * 渲染数据字典
         */
        private static renderDataMap = new Map<Object3D, RenderData>();

        /**
         * 获取3D对象渲染数据实例
         */
        static getInstance(object3D: Object3D) {

            var renderData = this.renderDataMap.get(object3D);
            if (!renderData) {
                renderData = new RenderData(object3D);
                this.renderDataMap.push(object3D, renderData);
            }
            return renderData;
        }

        private renderBufferMap = new Map<WebGLRenderingContext, RenderBuffer>();

        getRenderBuffer(context3D: WebGLRenderingContext) {

            var renderBuffer = this.renderBufferMap.get(context3D);
            if (!renderBuffer) {
                renderBuffer = new RenderBuffer(context3D, this);
                this.renderBufferMap.push(context3D, renderBuffer);
            }
            return renderBuffer;
        }

        /**
         * 构建3D对象渲染数据
         */
        constructor(object3D: Object3D) {
            this.object3D = object3D;
        }

        /**
         * 准备数据
         */
        prepare() {

            this.object3D.activate(this);
            //
            this.prepareProgram();
            this.prepareAttributes();
            this.prepareUniforms();
            this.prepareShaderParams();
        }

        /**
         * 准备程序
         */
        private prepareProgram() {

            //从Object3D中获取程序数据
            var eventData: GetProgramBufferEventData = { buffer: null };
            this.object3D.dispatchChildrenEvent(new Context3DBufferEvent(Context3DBufferEvent.GET_PROGRAMBUFFER, eventData), Number.MAX_VALUE);
            assert(eventData.buffer != null);
            this.programBuffer = eventData.buffer;
        }

        /**
         * 准备属性
         */
        private prepareAttributes() {

            this.attributes = ShaderCodeUtils.getAttributes(this.programBuffer.vertexCode);
            for (var name in this.attributes) {
                //从Object3D中获取顶点属性数据
                var eventData: GetAttributeBufferEventData = { name: name, buffer: null };
                this.object3D.dispatchChildrenEvent(new Context3DBufferEvent(Context3DBufferEvent.GET_ATTRIBUTEBUFFER, eventData), Number.MAX_VALUE);
                assert(eventData.buffer != null);

                this.attributes[name].buffer = eventData.buffer;
            }
        }

        /**
         * 准备常量
         */
        private prepareUniforms() {

            this.uniforms = this.programBuffer.getUniforms();

            for (var name in this.uniforms) {
                //从Object3D中获取常量数据
                var eventData: GetUniformBufferEventData = { name: name, buffer: null };
                this.object3D.dispatchChildrenEvent(new Context3DBufferEvent(Context3DBufferEvent.GET_UNIFORMBUFFER, eventData), Number.MAX_VALUE);
                assert(eventData.buffer != null);

                this.uniforms[name].buffer = eventData.buffer;
            }
        }

        /**
         * 准备常量
         */
        private prepareShaderParams() {

            //从Object3D中获取渲染参数
            var eventData: GetShaderParamEventData = { shaderParamID: ShaderParamID.renderMode, data: null };
            this.object3D.dispatchChildrenEvent(new Context3DBufferEvent(Context3DBufferEvent.GET_SHADERPARAM, eventData), Number.MAX_VALUE);
            if (eventData.data != null) {

                this.renderMode = eventData.data;
            }
        }
    }
}