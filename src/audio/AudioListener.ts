namespace feng3d
{
    export var audioCtx: AudioContext;
    export var globalGain: GainNode;

    export interface ComponentMap { AudioListener: AudioListener; }
    /**
     * 声音监听器
     */
    export class AudioListener extends Behaviour
    {
        gain: GainNode;

        get enabled()
        {
            return this._enabled;
        }
        set enabled(v)
        {
            if (this._enabled == v) return;
            this._enabled = v;
            this.enabledChanged();
        }
        private _enabled = true;

        /**
         * 音量
         */
        @serialize
        @oav({ tooltip: "音量" })
        get volume()
        {
            return this._volume;
        }
        set volume(v)
        {
            this._volume = v;
            this.gain.gain.setTargetAtTime(v, audioCtx.currentTime, 0.01);
        }
        private _volume = 1;

        constructor()
        {
            super();
            this.gain = audioCtx.createGain();
            this.gain.connect(audioCtx.destination);
            this.enabledChanged();
        }

        init()
        {
            super.init();
            this.on("scenetransformChanged", this.onScenetransformChanged, this);
            this.onScenetransformChanged();
        }

        private onScenetransformChanged()
        {
            var localToWorldMatrix = this.transform.localToWorldMatrix;
            var position = localToWorldMatrix.getPosition();
            var forward = localToWorldMatrix.forward;
            var up = localToWorldMatrix.up;
            //
            var listener = audioCtx.listener;
            // feng3d中为左手坐标系，listener中使用的为右手坐标系，参考https://developer.mozilla.org/en-US/docs/Web/API/AudioListener
            listener.positionX.value = position.x;
            listener.positionY.value = position.y;
            listener.positionZ.value = -position.z;
            listener.forwardX.value = forward.x;
            listener.forwardY.value = forward.y;
            listener.forwardZ.value = -forward.z;
            listener.upX.value = up.x;
            listener.upY.value = up.y;
            listener.upZ.value = -up.z;
        }

        private enabledChanged()
        {
            if (!this.gain) return;
            if (this.enabled)
            {
                globalGain.connect(this.gain);
            } else
            {
                globalGain.disconnect(this.gain);
            }
        }

        dispose()
        {
            this.off("scenetransformChanged", this.onScenetransformChanged, this);
            super.dispose();
        }
    }
}

(() =>
{
    if (typeof window == "undefined") return;

    window["AudioContext"] = window["AudioContext"] || window["webkitAudioContext"];

    var audioCtx = feng3d.audioCtx = new AudioContext();
    var globalGain = feng3d.globalGain = audioCtx.createGain();
    // 新增无音Gain，避免没有AudioListener组件时暂停声音播放进度
    var zeroGain = audioCtx.createGain();
    zeroGain.connect(audioCtx.destination);
    globalGain.connect(zeroGain);
    zeroGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.01);
    //
    var listener = audioCtx.listener;
    audioCtx.createGain();
    if (listener.forwardX)
    {
        listener.forwardX.value = 0;
        listener.forwardY.value = 0;
        listener.forwardZ.value = -1;
        listener.upX.value = 0;
        listener.upY.value = 1;
        listener.upZ.value = 0;
    } else
    {
        listener.setOrientation(0, 0, -1, 0, 1, 0);
    }
})();