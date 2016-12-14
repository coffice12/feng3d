module feng3d {

    /**
     * 材质
     * @author feng 2016-05-02
     */
    export class Material extends RenderDataHolder {

        protected programBuffer: ProgramRenderData;

        vertexShaderStr = //
        `
attribute vec3 vaPosition;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

void main(void) {
    gl_Position = uPMatrix * uMVMatrix * vec4(vaPosition, 1.0);
}`;
        fragmentShaderStr = //
        `
void main(void) {
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}`;
        private _pass: MaterialPassBase;

        /**
        * 渲染模式
        */
        renderMode = RenderMode.TRIANGLES;

        /**
         * 渲染通道
         */
        public get pass(): MaterialPassBase {

            return this._pass;
        }

        public set pass(value: MaterialPassBase) {

            this._pass && this.removeComponent(this._pass);
            this._pass = value;
            this._pass && this.addComponent(this._pass);
        }

        /**
         * 构建材质
         */
        constructor() {

            super();
            this.pass = new MaterialPassBase();

            this.programBuffer = new ProgramRenderData();
            this.programBuffer.vertexCode = this.vertexShaderStr;
            this.programBuffer.fragmentCode = this.fragmentShaderStr;
        }

        /**
		 * 激活
		 * @param renderData	渲染数据
		 */
        public activate(renderData: RenderAtomic) {

            //
            super.activate(renderData);
            //
            renderData.programBuffer = this.programBuffer;
        }

        /**
		 * 释放
		 * @param renderData	渲染数据
		 */
        public deactivate(renderData: RenderAtomic) {

            renderData.programBuffer = null;
            super.deactivate(renderData);
        }
    }
}