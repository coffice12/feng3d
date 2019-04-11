namespace feng3d
{
    /**
     * 默认文件系统
     */
    export var fs: ReadFS;
    /**
     * 可读文件系统
     */
    export abstract class ReadFS
    {
        /**
         * 文件系统类型
         */
        readonly type: FSType;

        /**
         * 读取文件为ArrayBuffer
         * @param path 路径
         * @param callback 读取完成回调 当err不为null时表示读取失败
         */
        abstract readArrayBuffer(path: string, callback: (err: Error, arraybuffer: ArrayBuffer) => void): void;

        /**
         * 读取文件为字符串
         * @param path 路径
         * @param callback 读取完成回调 当err不为null时表示读取失败
         */
        abstract readString(path: string, callback: (err: Error, str: string) => void): void;

        /**
         * 读取文件为Object
         * @param path 路径
         * @param callback 读取完成回调 当err不为null时表示读取失败
         */
        abstract readObject(path: string, callback: (err: Error, object: Object) => void): void;

        /**
         * 加载图片
         * @param path 图片路径
         * @param callback 加载完成回调
         */
        abstract readImage(path: string, callback: (err: Error, img: HTMLImageElement) => void): void;

        /**
         * 获取文件绝对路径
         * @param path （相对）路径
         */
        abstract getAbsolutePath(path: string): string;

        /**
         * 读取文件列表为字符串列表
         * 
         * @param path 路径
         * @param callback 读取完成回调 当err不为null时表示读取失败
         */
        readStrings(paths: string[], callback: (strs: (string | Error)[]) => void)
        {
            task.parallelResults(paths, (path, callback) =>
            {
                this.readString(path, (err, str) =>
                {
                    callback(err || str);
                });
            }, callback);
        }

        /**
         * 获取已经加载的图片，如果未加载则返回null
         * 
         * @param path 图片路径
         */
        getImage(path: string)
        {
            return this._images[path];
        }
        protected _images: { [path: string]: HTMLImageElement } = {};
    }
}