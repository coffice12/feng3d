module me.feng3d {

    /**
     * Context3D缓冲事件
     * @author feng 2016-05-26
     */
    export class Context3DBufferEvent extends Event {

        /**
         * 获取AttributeBuffer
         */
        static GET_ATTRIBUTEBUFFER = "getAttributeBuffer";

        /**
         * 获取IndexBuffer
         */
        static GET_INDEXBUFFER = "getIndexBuffer";
    }

    /**
     * 获取AttributeBuffer事件数据
     */
    export class GetAttributeBufferEventData {

        /**
         * 属性名称
         */
        name: string;

        /**
         * 属性缓冲
         */
        buffer: AttributeBuffer;
    }

    /**
     * 获取IndexBuffer事件数据
     */
    export class GetIndexBufferEventData {

        /**
         * 索引缓冲
         */
        buffer: IndexBuffer;
    }
}