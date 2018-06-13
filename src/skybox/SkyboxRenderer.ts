namespace feng3d
{
    /**
     * 天空盒渲染器
     */
    export var skyboxRenderer: SkyboxRenderer;

    /**
     * 天空盒渲染器
     */
    export class SkyboxRenderer
    {
        private renderAtomic: RenderAtomic;
        private renderParams: RenderParams;
        private shader: Shader;

        init()
        {
            if (!this.renderAtomic)
            {
                var renderAtomic = new RenderAtomic();
                //八个顶点，32个number
                var vertexPositionData = [ //
                    -1, 1, -1,//
                    1, 1, -1, //
                    1, 1, 1, //
                    -1, 1, 1, //
                    -1, -1, -1,//
                    1, -1, -1, //
                    1, -1, 1,//
                    -1, -1, 1 //
                ];
                renderAtomic.attributes.a_position = new Attribute("a_position", vertexPositionData, 3);
                //6个面，12个三角形，36个顶点索引
                var indices = [ //
                    0, 1, 2, 2, 3, 0, //
                    6, 5, 4, 4, 7, 6, //
                    2, 6, 7, 7, 3, 2, //
                    4, 5, 1, 1, 0, 4, //
                    4, 0, 3, 3, 7, 4, //
                    2, 1, 5, 5, 6, 2 //
                ];
                renderAtomic.indexBuffer = new Index();
                renderAtomic.indexBuffer.indices = indices;
                this.renderAtomic = renderAtomic;
                //
                var renderParams = new RenderParams();
                renderParams.renderMode = RenderMode.TRIANGLES;
                renderParams.enableBlend = false;
                renderParams.depthMask = true;
                renderParams.depthtest = true;
                renderParams.cullFace = CullFace.NONE;
                this.renderParams = renderParams;
                //

                this.shader = shaderlib.getShader("skybox");
            }
        }

        /**
         * 绘制场景中天空盒
         * @param gl 
         * @param scene3d 场景
         * @param camera 摄像机
         */
        draw(gl: GL, scene3d: Scene3D, camera: Camera)
        {
            var skybox = scene3d.getActiveSkyBox();
            this.drawSkyBox(gl, skybox, camera);
        }

        /**
         * 绘制天空盒
         * @param gl 
         * @param skybox 天空盒
         * @param camera 摄像机
         */
        drawSkyBox(gl: GL, skybox: SkyBox, camera: Camera)
        {
            if (!skybox) return;

            this.init();

            //
            this.renderAtomic.renderParams = this.renderParams;
            this.renderAtomic.shader = this.shader;
            skybox.gameObject.preRender(this.renderAtomic);

            //
            this.renderAtomic.uniforms.u_viewProjection = camera.viewProjection;
            this.renderAtomic.uniforms.u_viewMatrix = camera.transform.worldToLocalMatrix
            this.renderAtomic.uniforms.u_cameraMatrix = camera.transform.localToWorldMatrix;
            this.renderAtomic.uniforms.u_skyBoxSize = camera.lens.far / Math.sqrt(3);

            gl.renderer.draw(this.renderAtomic);
        }
    }

    skyboxRenderer = new SkyboxRenderer();
}