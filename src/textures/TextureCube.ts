module feng3d {

    /**
     * 立方体纹理
     * @author feng 2016-12-28
     */
    export class TextureCube extends TextureInfo {

        public pixels: HTMLImageElement[];

        constructor() {
            super();
            this.textureType = WebGLRenderingContext.TEXTURE_CUBE_MAP;
        }
    }
}