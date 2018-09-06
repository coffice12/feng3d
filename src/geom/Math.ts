namespace feng3d
{
    export var FMath = {
        /**
         * 角度转弧度因子
         */
        DEG2RAD: Math.PI / 180,
        /**
         * 弧度转角度因子
         */
        RAD2DEG: 180 / Math.PI,
        /**
         * 默认精度
         */
        PRECISION: 0.000001,
        /**
         * http://www.broofa.com/Tools/Math.uuid.htm
         */
        uuid: function ()
        {
            // http://www.broofa.com/Tools/Math.uuid.htm
            var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
            var id = new Array(36);
            var rnd = 0, r;
            return function generateUUID()
            {
                for (var i = 0; i < 36; i++)
                {
                    if (i === 8 || i === 13 || i === 18 || i === 23)
                    {
                        id[i] = '-';
                    } else if (i === 14)
                    {
                        id[i] = '4';
                    } else
                    {
                        if (rnd <= 0x02) rnd = 0x2000000 + (Math.random() * 0x1000000) | 0;
                        r = rnd & 0xf;
                        rnd = rnd >> 4;
                        id[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
                    }
                }
                return id.join('');
            };
        }(),

        clamp: function (value, min, max)
        {
            return Math.max(min, Math.min(max, value));
        },

        /**
         * compute euclidian modulo of m % n
         * https://en.wikipedia.org/wiki/Modulo_operation
         */
        euclideanModulo: function (n, m)
        {
            return ((n % m) + m) % m;
        },

        /**
         * Linear mapping from range <a1, a2> to range <b1, b2>
         */
        mapLinear: function (x, a1, a2, b1, b2)
        {
            return b1 + (x - a1) * (b2 - b1) / (a2 - a1);
        },

        /**
         * https://en.wikipedia.org/wiki/Linear_interpolation
         */
        lerp: function (x, y, t)
        {
            return (1 - t) * x + t * y;
        },

        /**
         * http://en.wikipedia.org/wiki/Smoothstep
         */
        smoothstep: function (x, min, max)
        {
            if (x <= min) return 0;
            if (x >= max) return 1;

            x = (x - min) / (max - min);

            return x * x * (3 - 2 * x);
        },

        smootherstep: function (x, min, max)
        {
            if (x <= min) return 0;
            if (x >= max) return 1;

            x = (x - min) / (max - min);

            return x * x * x * (x * (x * 6 - 15) + 10);
        },

        /**
         * Random integer from <low, high> interval
         */
        randInt: function (low, high)
        {
            return low + Math.floor(Math.random() * (high - low + 1));
        },

        /**
         * Random float from <low, high> interval
         */
        randFloat: function (low, high)
        {
            return low + Math.random() * (high - low);
        },


        /**
         * Random float from <-range/2, range/2> interval
         */
        randFloatSpread: function (range)
        {
            return range * (0.5 - Math.random());
        },


        degToRad: function (degrees)
        {
            return degrees * this.DEG2RAD;
        },

        radToDeg: function (radians)
        {
            return radians * this.RAD2DEG;
        },


        isPowerOfTwo: function (value)
        {
            return (value & (value - 1)) === 0 && value !== 0;
        },

        nearestPowerOfTwo: function (value)
        {
            return Math.pow(2, Math.round(Math.log(value) / Math.LN2));
        },

        nextPowerOfTwo: function (value)
        {
            value--;
            value |= value >> 1;
            value |= value >> 2;
            value |= value >> 4;
            value |= value >> 8;
            value |= value >> 16;
            value++;
            return value;
        },

        /**
         * 获取目标最近的值
         * 
         * source增加或者减少整数倍precision后得到离target最近的值
         * 
         * ```
         * Math.toRound(71,0,5);//运算结果为1
         * ```
         * 
         * @param source 初始值
         * @param target 目标值
         * @param precision 精度
         */
        toRound: function (source: number, target: number, precision = 360) 
        {
            return source + Math.round((target - source) / precision) * precision;
        },

        /**
         * 比较两个Number是否相等
         * @param a 数字a
         * @param b 数字b
         * @param precision 进度
         */
        equals(a: number, b: number, precision?: number)
        {
            if (precision == undefined)
                precision = this.PRECISION;
            return Math.abs(a - b) < precision;
        }
    };
}