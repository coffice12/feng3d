namespace feng3d
{
    /**
     * 图片相关工具
     */
    export var imageUtil: ImageUtil;

    /**
     * 图片相关工具
     */
    export class ImageUtil
    {
        /**
         * 加载图片
         * @param url 图片路径
         * @param callback 加载完成回调
         */
        loadImage(url: string, callback: (err: Error, image: HTMLImageElement) => void) 
        {
            assets.readImage(url, callback);
        }

        /**
         * 获取图片数据
         * @param image 加载完成的图片元素
         */
        getImageData(image: HTMLImageElement) 
        {
            if (!image) return null;
            var canvasImg = document.createElement("canvas");
            canvasImg.width = image.width;
            canvasImg.height = image.height;

            var ctxt = canvasImg.getContext('2d');
            assert(!!ctxt);
            ctxt.drawImage(image, 0, 0);
            var imageData = ctxt.getImageData(0, 0, image.width, image.height);//读取整张图片的像素。
            return imageData;
        }

        /**
         * 从url获取图片数据
         * @param url 图片路径
         * @param callback 获取图片数据完成回调
         */
        getImageDataFromUrl(url: string, callback: (imageData: ImageData) => void) 
        {
            this.loadImage(url, (err, image) =>
            {
                var imageData = this.getImageData(image);
                callback(imageData);
            });
        }

        /**
         * 创建ImageData
         * @param width 数据宽度
         * @param height 数据高度
         * @param fillcolor 填充颜色
         */
        createImageData(width = 1024, height = 1024, fillcolor = 0)
        {
            var canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            var ctx = canvas.getContext('2d');
            ctx.fillStyle = new Color3().fromUnit(fillcolor).toHexString();
            ctx.fillRect(0, 0, width, height);

            var imageData = ctx.getImageData(0, 0, width, height);

            return imageData;
        }

        /**
         * 创建默认粒子贴图
         * @param size 尺寸
         */
        createDefaultParticle(size = 64)
        {
            var canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;

            var ctx = canvas.getContext('2d');
            ctx.fillStyle = new Color3().fromUnit(0).toHexString();
            ctx.fillRect(0, 0, size, size);

            var half = size / 2;
            for (let i = 0; i < size; i++)
            {
                for (let j = 0; j < size; j++)
                {
                    var vec = new Vector2(i - half, j - half);
                    var f = 1 - FMath.clamp(vec.length, 0, half) / half;
                    ctx.fillStyle = new Color3(f, f, f).toHexString();
                    ctx.fillRect(i, j, 1, 1);
                }
            }
            var imageData = ctx.getImageData(0, 0, size, size);
            return imageData;
        }

        /**
         * 创建颜色拾取矩形
         * @param color 基色
         * @param width 宽度    
         * @param height 高度
         */
        createColorPickerRect(color: number, width = 64, height = 64)
        {
            var leftTop = new Color3(1, 1, 1);
            var rightTop = new Color3().fromUnit(color);
            var leftBottom = new Color3(0, 0, 0);
            var rightBottom = new Color3(0, 0, 0);

            var canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            var ctx = canvas.getContext('2d');
            //
            for (let i = 0; i < width; i++)
            {
                for (let j = 0; j < height; j++)
                {
                    var top = leftTop.mixTo(rightTop, i / width);
                    var bottom = leftBottom.mixTo(rightBottom, i / width);
                    var v = top.mixTo(bottom, j / height);
                    //
                    ctx.fillStyle = v.toHexString();
                    ctx.fillRect(i, j, 1, 1);
                }
            }
            var imageData = ctx.getImageData(0, 0, width, height);
            return imageData;
        }

        /**
         * 获取颜色的基色以及颜色拾取矩形所在位置
         * @param color 查找颜色
         */
        getColorPickerRectPosition(color: number)
        {
            var black = new Color3(0, 0, 0);
            var white = new Color3(1, 1, 1);

            var c = new Color3().fromUnit(color);
            var max = Math.max(c.r, c.g, c.b);
            c = black.mix(c, 1 / max);
            var min = Math.min(c.r, c.g, c.b);
            c = white.mix(c, 1 / (1 - min));
            var ratioH = 1 - max;
            var ratioW = 1 - min;
            return {
                /**
                 * 基色
                 */
                color: c,
                /**
                 * 横向位置
                 */
                ratioW: ratioW,
                /**
                 * 纵向位置
                 */
                ratioH: ratioH
            }
        }

        /**
         * 创建颜色条带
         * @param colors 
         * @param ratios [0,1]
         * @param width 
         * @param height 
         * @param dirw true为横向条带，否则纵向条带
         */
        createColorPickerStripe(width: number, height: number, colors: number[], ratios?: number[], dirw = true)
        {
            if (!ratios)
            {
                ratios = [];
                for (let i = 0; i < colors.length; i++)
                {
                    ratios[i] = i / (colors.length - 1);
                }
            }

            var canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            var ctx = canvas.getContext('2d');
            //
            for (let i = 0; i < width; i++)
            {
                for (let j = 0; j < height; j++)
                {
                    var v = this.getMixColor(colors, ratios, dirw ? i / (width - 1) : j / (height - 1));
                    //
                    ctx.fillStyle = v.toHexString();
                    ctx.fillRect(i, j, 1, 1);
                }
            }
            var imageData = ctx.getImageData(0, 0, width, height);
            return imageData;
        }

        getMixColor(colors: number[], ratios: number[], ratio: number)
        {
            if (!ratios)
            {
                ratios = [];
                for (let i = 0; i < colors.length; i++)
                {
                    ratios[i] = i / (colors.length - 1);
                }
            }

            var colors1 = colors.map(v => new Color3().fromUnit(v));

            for (var i = 0; i < colors1.length - 1; i++)
            {
                if (ratios[i] <= ratio && ratio <= ratios[i + 1])
                {
                    var v = FMath.mapLinear(ratio, ratios[i], ratios[i + 1], 0, 1)
                    var c = colors1[i].mixTo(colors1[i + 1], v);
                    return c;
                }
            }
            return colors1[0];
        }

        getMixColorRatio(color: number, colors: number[], ratios?: number[])
        {
            if (!ratios)
            {
                ratios = [];
                for (let i = 0; i < colors.length; i++)
                {
                    ratios[i] = i / (colors.length - 1);
                }
            }

            var colors1 = colors.map(v => new Color3().fromUnit(v));
            var c = new Color3().fromUnit(color);

            var r = c.r;
            var g = c.g;
            var b = c.b;

            for (var i = 0; i < colors1.length - 1; i++)
            {
                var c0 = colors1[i];
                var c1 = colors1[i + 1];
                //
                if (c.equals(c0)) return ratios[i];
                if (c.equals(c1)) return ratios[i + 1];
                //
                var r1 = c0.r + c1.r;
                var g1 = c0.g + c1.g;
                var b1 = c0.b + c1.b;
                //
                var v = r * r1 + g * g1 + b * b1;
                if (v > 2)
                {
                    var result = 0;
                    if (r1 == 1)
                    {
                        result = FMath.mapLinear(r, c0.r, c1.r, ratios[i], ratios[i + 1]);
                    } else if (g1 == 1)
                    {
                        result = FMath.mapLinear(g, c0.g, c1.g, ratios[i], ratios[i + 1]);
                    } else if (b1 == 1)
                    {
                        result = FMath.mapLinear(b, c0.b, c1.b, ratios[i], ratios[i + 1]);
                    }
                    return result;
                }
            }
            return 0;
        }
    }

    imageUtil = new ImageUtil();
}