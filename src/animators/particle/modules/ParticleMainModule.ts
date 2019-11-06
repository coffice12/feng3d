namespace feng3d
{
    /**
     * 粒子主模块
     */
    export class ParticleMainModule extends ParticleModule
    {
        @oav({ exclude: true })
        enabled = true;

        /**
         * 粒子系统的持续时间(秒)。
         */
        @serialize
        // @oav({ tooltip: "The duration of the particle system in seconds." })
        @oav({ tooltip: "粒子系统的持续时间(秒)。" })
        duration = 5;

        /**
         * 粒子系统在循环吗?
         */
        @serialize
        // @oav({ tooltip: "Is the particle system looping?" })
        @oav({ tooltip: "粒子系统在循环吗?" })
        loop = true;

        /**
         * 启动延迟(以秒为单位)。
         */
        @serialize
        // @oav({ tooltip: "Start delay in seconds." })
        @oav({ tooltip: "启动延迟(以秒为单位)。" })
        startDelay = 0;

        /**
         * 每个新粒子的总寿命(以秒计)。
         */
        @serialize
        // @oav({ tooltip: "The total lifetime in seconds that each new particle will have." })
        @oav({ tooltip: "每个新粒子的总寿命(以秒计)。" })
        startLifetime = serialization.setValue(new MinMaxCurve(), { between0And1: true, constant: 5, constant1: 5 });

        /**
         * 粒子发射时的初始速度。
         */
        @serialize
        // @oav({ tooltip: "The initial speed of particles when emitted." })
        @oav({ tooltip: "粒子发射时的初始速度。" })
        startSpeed = serialization.setValue(new MinMaxCurve(), { constant: 5, constant1: 5 });

        @serialize
        // @oav({ tooltip: "A flag to enable specifying particle size individually for each axis." })
        @oav({ tooltip: "允许为每个轴分别指定粒度大小的标志。" })
        useStartSize3D = false;

        /**
         * 发射时粒子的初始大小。
         */
        @serialize
        // @oav({ tooltip: "The initial size of particles when emitted." })
        @oav({ tooltip: "发射时粒子的初始大小。" })
        startSize3D = serialization.setValue(new MinMaxCurveVector3(), { xCurve: { between0And1: true, constant: 1, constant1: 1 }, yCurve: { between0And1: true, constant: 1, constant1: 1 }, zCurve: { between0And1: true, constant: 1, constant1: 1 } });

        @serialize
        // @oav({ tooltip: "The initial size of particles when emitted." })
        @oav({ tooltip: "粒子发射时的初始大小。" })
        get startSize()
        {
            return this.startSize3D.xCurve;
        }
        set startSize(v)
        {
            this.startSize3D.xCurve = v;
        }

        @serialize
        // @oav({ tooltip: "A flag to enable 3D particle rotation." })
        @oav({ tooltip: "一个启用粒子3D旋转的标记。" })
        useStartRotation3D = false;

        /**
         * 粒子发射时的初始旋转。
         */
        @serialize
        // @oav({ tooltip: "The initial rotation of particles when emitted." })
        @oav({ tooltip: "粒子发射时的初始旋转。" })
        startRotation3D = serialization.setValue(new MinMaxCurveVector3(), { xCurve: { curveMultiplier: 180 }, yCurve: { curveMultiplier: 180 }, zCurve: { curveMultiplier: 180 } });

        @serialize
        // @oav({ tooltip: "The initial rotation of particles when emitted." })
        @oav({ tooltip: "粒子发射时的初始旋转。" })
        get startRotation()
        {
            return this.startRotation3D.zCurve;
        }
        set startRotation(v)
        {
            this.startRotation3D.zCurve = v;
        }

        /**
         * 粒子发射时的初始颜色。
         */
        @serialize
        @oav({ tooltip: "The initial color of particles when emitted." })
        @oav({ tooltip: "粒子发射时的初始颜色。" })
        startColor = new MinMaxGradient();

        /**
         * 应用于重力加速度的缩放。
         */
        @serialize
        // @oav({ tooltip: "Scale applied to the gravity." })
        @oav({ tooltip: "应用于重力加速度的缩放。" })
        gravityModifier = new MinMaxCurve();

        /**
         * 模拟空间，使粒子位置模拟在世界，本地或自定义空间。在本地空间中，它们相对于自己的转换而存在，在自定义空间中，它们相对于自定义转换。
         */
        @serialize
        // @oav({ tooltip: "This selects the space in which to simulate particles. It can be either world or local space.", component: "OAVEnum", componentParam: { enumClass: ParticleSystemSimulationSpace } })
        @oav({ tooltip: "模拟空间，使粒子位置模拟在世界，本地或自定义空间。在本地空间中，它们相对于自己的转换而存在，在自定义空间中，它们相对于自定义转换。", component: "OAVEnum", componentParam: { enumClass: ParticleSystemSimulationSpace } })
        simulationSpace = ParticleSystemSimulationSpace.Local;

        /**
         * 模拟相对于自定义转换组件的粒子。
         */
        @serialize
        // @oav({ tooltip: "Simulate particles relative to a custom transform component." })
        @oav({ tooltip: "模拟相对于自定义转换组件的粒子。" })
        customSimulationSpace: Transform;

        /**
         * 重写粒子系统的默认播放速度。
         */
        @serialize
        // @oav({ tooltip: "Override the default playback speed of the Particle System." })
        @oav({ tooltip: "重写粒子系统的默认播放速度。" })
        simulationSpeed = 1;

        /**
         * 控制粒子系统的变换组件如何应用于粒子系统。
         */
        @serialize
        // @oav({ tooltip: "Control how the particle system's Transform Component is applied to the particle system." })
        @oav({ tooltip: "控制粒子系统的变换组件如何应用于粒子系统。" })
        scalingMode = ParticleSystemScalingMode.Local;

        /**
         * 如果设置为真，粒子系统将自动开始播放启动。
         */
        @serialize
        // @oav({ tooltip: "If set to true, the particle system will automatically start playing on startup." })
        @oav({ tooltip: "如果设置为真，粒子系统将自动开始播放启动。" })
        playOnAwake = true;

        /**
         * 发射粒子的最大数量。
         */
        @serialize
        @oav({ tooltip: "The maximum number of particles to emit." })
        @oav({ tooltip: "发射粒子的最大数量。" })
        maxParticles = 1000;

        /**
         * 此时在周期中的位置
         */
        get rateAtDuration()
        {
            return ((this.particleSystem.time - this.startDelay) % this.duration) / this.duration;
        }

        /**
         * 初始化粒子状态
         * @param particle 粒子
         */
        initParticleState(particle: Particle)
        {
            var rateAtDuration = ((particle.birthTime - this.startDelay) % this.duration) / this.duration;
            //
            particle.birthRateAtDuration = rateAtDuration;

            particle.position.init(0, 0, 0);
            particle.velocity.init(0, 0, this.startSpeed.getValue(rateAtDuration));
            if (this.useStartSize3D)
            {
                particle.startScale.copy(this.startSize3D.getValue(rateAtDuration));
            } else
            {
                var startSize = this.startSize.getValue(rateAtDuration);
                particle.startScale.init(startSize, startSize, startSize);
            }

            //
            if (this.useStartRotation3D)
            {
                particle.rotation.copy(this.startRotation3D.getValue(rateAtDuration));
            } else
            {
                var startRotation = this.startRotation.getValue(rateAtDuration);
                particle.rotation.init(0, 0, startRotation);
            }
            //
            particle.startColor.copy(this.startColor.getValue(rateAtDuration));
        }

        /**
         * 更新粒子状态
         * @param particle 粒子
         */
        updateParticleState(particle: Particle, preTime: number, time: number, rateAtLifeTime: number)
        {
            // 计算重力加速度影响速度
            var globalAcceleration = new Vector3(0, -this.gravityModifier.getValue(this.rateAtDuration) * 9.8, 0);

            // 本地加速度
            var localAcceleration = this.particleSystem.transform.worldToLocalMatrix.deltaTransformVector(globalAcceleration);

            //
            particle.velocity.x += localAcceleration.x * (time - preTime);
            particle.velocity.y += localAcceleration.y * (time - preTime);
            particle.velocity.z += localAcceleration.z * (time - preTime);

            //
            particle.scale.copy(particle.startScale);
            //
            particle.color.copy(particle.startColor);
        }
    }
}