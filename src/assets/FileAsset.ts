namespace feng3d
{
    /**
     * feng3d资源
     */
    export abstract class FileAsset
    {
        /**
         * 资源编号
         */
        @serialize
        assetId: string;

        /**
         * 名称
         */
        @oav()
        @serialize
        get name() { return this._name; }
        set name(v) { this._name = v; if (this.data) this.data.name = v; }
        private _name = "";

        /**
         * 资源元标签，该对象也用来判断资源是否被加载，值为null表示未加载，否则已加载。
         */
        meta: AssetMeta;

        /**
         * 资源系统
         * 
         * 加载或者创建该资源的资源系统
         */
        rs: ReadWriteRS;

        /**
         * 资源类型，由具体对象类型决定
         */
        assetType: AssetType;

        /**
         * 文件后缀
         */
        @serialize
        extenson: string = "";

        /**
         * 父资源
         */
        parentAsset: FolderAsset;

        /**
         * 资源路径
         */
        assetPath: string;

        /**
         * 资源对象
         */
        data: AssetData;

        /**
         * 读取资源
         * 
         * @param callback 完成回调
         */
        read(callback: (err: Error) => void)
        {
            this.rs.readAsset(this.assetId, callback);
        }

        /**
         * 写入资源
         * 
         * @param callback 完成回调
         */
        write(callback?: (err: Error) => void)
        {
            this.rs.writeAsset(this, callback);
        }

        /**
         * 删除资源
         * 
         * @param callback 完成回调
         */
        delete(callback?: (err: Error) => void)
        {
            this.rs.deleteAsset(this, callback);
        }

        /**
         * 读取资源缩略图标
         * 
         * @param callback 完成回调
         */
        readThumbnail(callback: (err: Error, image: HTMLImageElement) => void)
        {
            if (this._thumbnail)
            {
                callback(null, this._thumbnail);
                return;
            }
            this.rs.fs.readImage(this.thumbnailPath, (err, image) =>
            {
                this._thumbnail = image;
                callback(err, image);
            });
        }

        /**
         * 读取资源缩略图标
         * 
         * @param image 缩略图
         * @param callback 完成回调
         */
        writeThumbnail(image: HTMLImageElement, callback?: (err: Error) => void)
        {
            if (this._thumbnail == image)
            {
                callback && callback(null);
                return;
            }
            this._thumbnail = image;
            this.rs.fs.writeImage(this.thumbnailPath, image, callback);
        }

        /**
         * 删除资源缩略图标
         * 
         * @param callback 完成回调
         */
        deleteThumbnail(callback?: (err: Error) => void)
        {
            this.rs.fs.deleteFile(this.thumbnailPath, callback);
        }

        /**
         * 读取文件
         * 
         * @param callback 完成回调
         */
        protected abstract readFile(callback?: (err: Error) => void): void;

        /**
         * 保存文件
         * 
         * @param callback 完成回调
         */
        protected abstract saveFile(callback?: (err: Error) => void): void;

        /**
         * 删除文件
         * 
         * @param callback 完成回调
         */
        protected deleteFile(callback?: (err: Error) => void)
        {
            this.rs.fs.deleteFile(this.assetPath, callback);

            // 延迟一帧判断该资源是否被删除，排除移动文件时出现的临时删除情况
            ticker.nextframe(() =>
            {
                if (this.rs.getAsset(this.assetId) == null)
                {
                    this.deleteThumbnail();
                }
            });
        }

        /**
         * 缩略图
         */
        private _thumbnail: HTMLImageElement;

        /**
         * 缩略图路径
         */
        private get thumbnailPath()
        {
            return "assetIcons/" + this.assetId + ".png";
        }
    }
}