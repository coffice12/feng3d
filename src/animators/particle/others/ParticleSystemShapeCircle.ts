namespace feng3d
{
    /**
     * 粒子系统 发射圆盘
     */
    export class ParticleSystemShapeCircle extends ParticleSystemShape
    {
        @serialize
        @oav({ tooltip: "半径" })
        get radius()
        {
            return this._module.radius;
        }

        set radius(v)
        {
            this._module.radius = v;
        }

        @serialize
        @oav({ tooltip: "弧度" })
        get arc()
        {
            return this._module.arc;
        }

        set arc(v)
        {
            this._module.arc = v;
        }

        /**
         * The mode used for generating particles around the arc.
         * 
         * 在弧线周围产生粒子的模式。
         */
        @serialize
        // @oav({ tooltip: "The mode used for generating particles around the arc.", component: "OAVEnum", componentParam: { enumClass: ParticleSystemShapeMultiModeValue } })
        @oav({ tooltip: "在弧线周围产生粒子的模式。", component: "OAVEnum", componentParam: { enumClass: ParticleSystemShapeMultiModeValue } })
        get arcMode()
        {
            return this._module.arcMode;
        }

        set arcMode(v)
        {
            this._module.arcMode = v;
        }

        /**
         * Control the gap between emission points around the arc.
         * 
         * 控制弧线周围发射点之间的间隙。
         */
        @serialize
        @oav({ tooltip: "控制弧线周围发射点之间的间隙。" })
        get arcSpread()
        {
            return this._module.arcSpread;
        }

        set arcSpread(v)
        {
            this._module.arcSpread = v;
        }

        /**
         * When using one of the animated modes, how quickly to move the emission position around the arc.
         * 当使用一个动画模式时，如何快速移动发射位置周围的弧。
         */
        @serialize
        @oav({ tooltip: "当使用一个动画模式时，如何快速移动发射位置周围的弧。" })
        get arcSpeed()
        {
            return this._module.arcSpeed;
        }

        set arcSpeed(v)
        {
            this._module.arcSpeed = v;
        }

        /**
         * 是否从圆形边缘发射。
         */
        @serialize
        @oav({ tooltip: "是否从圆形边缘发射。" })
        emitFromEdge = false;

        /**
         * 初始化粒子状态
         * @param particle 粒子
         */
        initParticleState(particle: Particle)
        {
            var speed = particle.velocity.length;
            var radius = this.radius;
            var arc = this.arc;
            // 在圆心的方向
            var radiusAngle = 0;
            if (this.arcMode == ParticleSystemShapeMultiModeValue.Random)
            {
                radiusAngle = Math.random() * arc;
            } else if (this.arcMode == ParticleSystemShapeMultiModeValue.Loop)
            {
                var totalAngle = particle.birthTime * this.arcSpeed.getValue(particle.birthRateAtDuration) * 360;
                radiusAngle = totalAngle % arc;
            } else if (this.arcMode == ParticleSystemShapeMultiModeValue.PingPong)
            {
                var totalAngle = particle.birthTime * this.arcSpeed.getValue(particle.birthRateAtDuration) * 360;
                radiusAngle = totalAngle % arc;
                if (Math.floor(totalAngle / arc) % 2 == 1)
                {
                    radiusAngle = arc - radiusAngle;
                }
            }
            // else if (this.arcMode == ParticleSystemShapeMultiModeValue.BurstSpread)
            // {
            // }
            if (this.arcSpread > 0)
            {
                radiusAngle = Math.floor(radiusAngle / arc / this.arcSpread) * arc * this.arcSpread;
            }
            radiusAngle = Math.degToRad(radiusAngle);
            // 计算位置
            var dir = new Vector3(Math.cos(radiusAngle), Math.sin(radiusAngle), 0);
            var p = dir.scaleNumberTo(radius);
            if (!this.emitFromEdge)
            {
                p.scaleNumber(Math.random());
            }
            //
            particle.position.copy(p);

            // 计算速度
            particle.velocity.copy(dir).scaleNumber(speed);
        }
    }
}