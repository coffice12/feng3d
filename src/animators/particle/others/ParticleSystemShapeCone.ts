namespace feng3d
{
    /**
     * The mode used to generate new points in a shape (Shuriken).
     * 用于在形状中生成新点的模式
     */
    export enum ParticleSystemShapeMultiModeValue
    {
        /**
         * Generate points randomly. (Default)
         * 生成随机点。(默认)
         */
        Random,
        /**
         * Animate the emission point around the shape.
         * 使发射点围绕形状运动。
         */
        Loop,
        /**
         * Animate the emission point around the shape, alternating between clockwise and counter-clockwise directions.
         * 使发射点围绕形状运动，在顺时针和逆时针方向之间交替。
         */
        PingPong,
        /**
         * Distribute new particles around the shape evenly.
         * 在形状周围均匀分布新粒子。
         */
        BurstSpread,
    }

    /**
     * 粒子系统圆锥体发射类型，用于定义基于圆锥体的发射类型。
     */
    export enum ParticleSystemShapeConeEmitFrom
    {
        /**
         * 从圆锥体底面发射。
         */
        Base,
        /**
         * 从圆锥体底面边缘沿着曲面发射。
         */
        BaseShell,
        /**
         * 从圆锥体内部发射。
         */
        Volume,
        /**
         * 从圆锥体曲面沿着曲面发射。
         */
        VolumeShell,
    }

    /**
     * 粒子系统发射圆锥体，用于定义基于圆锥体的粒子发射时的初始状态。
     */
    export class ParticleSystemShapeCone extends ParticleSystemShape
    {
        /**
         * Angle of the cone.
         * 圆锥的角度。
         */
        @serialize
        // @oav({ tooltip: "Angle of the cone." })
        @oav({ tooltip: "圆锥的角度。" })
        angle = 25;

        /**
         * 圆锥体底部半径。
         */
        @serialize
        @oav({ tooltip: "圆锥体底部半径。" })
        radius = 1;

        /**
         * 圆锥体高度。
         */
        @serialize
        @oav({ tooltip: "圆锥体高度。" })
        height = 5;

        /**
         * Circle arc angle.
         */
        @serialize
        @oav({ tooltip: "圆弧角。" })
        arc = 360;

        /**
         * The mode used for generating particles around the arc.
         * 在弧线周围产生粒子的模式。
         */
        @serialize
        @oav({ tooltip: "在弧线周围产生粒子的模式。", component: "OAVEnum", componentParam: { enumClass: ParticleSystemShapeMultiModeValue } })
        arcMode = ParticleSystemShapeMultiModeValue.Random;

        /**
         * Control the gap between emission points around the arc.
         * 控制弧线周围发射点之间的间隙。
         */
        @serialize
        @oav({ tooltip: "控制弧线周围发射点之间的间隙。" })
        arcSpread = 0;

        /**
         * When using one of the animated modes, how quickly to move the emission position around the arc.
         * 当使用一个动画模式时，如何快速移动发射位置周围的弧。
         */
        @serialize
        @oav({ tooltip: "当使用一个动画模式时，如何快速移动发射位置周围的弧。" })
        arcSpeed = serialization.setValue(new MinMaxCurve(), { constant: 1, constant1: 1 });

        /**
         * 粒子系统圆锥体发射类型。
         */
        @serialize
        @oav({ tooltip: "粒子系统圆锥体发射类型。", component: "OAVEnum", componentParam: { enumClass: ParticleSystemShapeConeEmitFrom } })
        emitFrom = ParticleSystemShapeConeEmitFrom.Base;

        /**
         * 初始化粒子状态
         * @param particle 粒子
         */
        initParticleState(particle: Particle)
        {
            var speed = particle.velocity.length;
            var radius = this.radius;
            var angle = this.angle;
            var arc = this.arc;
            angle = Math.clamp(angle, 0, 87);
            

            // 在圆心的放心
            var radiusAngle = Math.random() * Math.degToRad(arc);
            // 在圆的位置
            var radiusRate = 1;
            if (this.emitFrom == ParticleSystemShapeConeEmitFrom.Base || this.emitFrom == ParticleSystemShapeConeEmitFrom.Volume)
            {
                radiusRate = Math.random();
            }
            // 在圆的位置
            var basePos = new Vector3(Math.sin(radiusAngle), Math.cos(radiusAngle), 0);
            // 底面位置
            var bottomPos = basePos.scaleNumberTo(radius).scaleNumber(radiusRate);
            // 顶面位置
            var topPos = basePos.scaleNumberTo(radius + this.height * Math.tan(Math.degToRad(angle))).scaleNumber(radiusRate);
            topPos.z = this.height;
            // 计算速度
            particle.velocity.copy(topPos.subTo(bottomPos).normalize(speed));
            // 计算位置
            var position = bottomPos.clone();
            if (this.emitFrom == ParticleSystemShapeConeEmitFrom.Volume || this.emitFrom == ParticleSystemShapeConeEmitFrom.VolumeShell)
            {
                // 上下点进行插值
                position.lerpNumber(topPos, Math.random());
            }
            particle.position.copy(position);
        }
    }
}