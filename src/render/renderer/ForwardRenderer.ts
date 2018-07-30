namespace feng3d
{

    /**
     * 前向渲染器
     * @author feng 2017-02-20
     */
    export var forwardRenderer: ForwardRenderer;

    /**
     * 前向渲染器
     * @author feng 2017-02-20
     */
    export class ForwardRenderer
    {
        renderAtomic = new RenderAtomic();

        /**
         * 渲染
         */
        draw(gl: GL, scene3d: Scene3D, camera: Camera)
        {
            var blenditems = scene3d.getPickCache(camera).blenditems;
            var unblenditems = scene3d.getPickCache(camera).unblenditems;

            var uniforms = this.renderAtomic.uniforms;
            //
            uniforms.u_projectionMatrix = () => camera.lens.matrix;
            uniforms.u_viewProjection = () => camera.viewProjection;
            uniforms.u_viewMatrix = () => camera.transform.worldToLocalMatrix;
            uniforms.u_cameraMatrix = () => camera.transform.localToWorldMatrix;
            uniforms.u_skyBoxSize = () => camera.lens.far / Math.sqrt(3);
            uniforms.u_scaleByDepth = () => camera.getScaleByDepth(1);

            uniforms.u_sceneAmbientColor = scene3d.ambientColor;

            unblenditems.concat(blenditems).forEach(meshRenderer =>
            {
                //绘制
                var renderAtomic = meshRenderer.gameObject.renderAtomic;

                meshRenderer.gameObject.beforeRender(gl, renderAtomic, scene3d, camera);

                renderAtomic.next = this.renderAtomic;

                gl.renderer.draw(renderAtomic);
            });
        }
    }

    forwardRenderer = new ForwardRenderer();
}