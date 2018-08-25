namespace feng3d
{
    /**
	 * 组件事件
	 */
    export interface GameObjectEventMap
    {
        addToScene: GameObject;
        removeFromScene: GameObject;
        addComponentToScene: Component;
        removeComponentFromScene: Component;
    }

    export interface ComponentMap { Scene3D: Scene3D; }

    /**
     * 3D场景
     */
    export class Scene3D extends Component
    {

        __class__: "feng3d.Scene3D" = "feng3d.Scene3D";

        /**
         * 背景颜色
         */
        @serialize
        @oav()
        background = new Color4(0, 0, 0, 1);
        /**
         * 环境光强度
         */
        @serialize
        @oav()
        ambientColor = new Color4();

        /**
         * 指定更新脚本标记，用于过滤需要调用update的脚本
         */
        updateScriptFlag = ScriptFlag.feng3d;

        private _mouseCheckObjects: GameObject[];
        private _models: Model[];
        private _visibleAndEnabledModels: Model[];
        private _skyBoxs: SkyBox[];
        private _activeSkyBoxs: SkyBox[];
        private _directionalLights: DirectionalLight[];
        private _activeDirectionalLights: DirectionalLight[];
        private _pointLights: PointLight[];
        private _activePointLights: PointLight[];
        private _spotLights: SpotLight[];
        private _activeSpotLights: SpotLight[];
        private _animations: Animation[];
        private _activeAnimations: Animation[];
        private _behaviours: Behaviour[];
        private _activeBehaviours: Behaviour[];

        /**
         * 构造3D场景
         */
        init(gameObject: GameObject)
        {
            super.init(gameObject);
            gameObject["_scene"] = this;
            this.transform.hideFlags = HideFlags.Hide;

            ticker.onframe(this.onEnterFrame, this)

            this.initCollectComponents();
        }

        dispose()
        {
            ticker.offframe(this.onEnterFrame, this)
            super.dispose();
        }

        initCollectComponents()
        {
            var _this = this;
            collect(this.gameObject);

            function collect(gameobject: GameObject)
            {
                gameobject["_scene"] = _this;
                _this._addGameObject(gameobject);

                gameobject.children.forEach(element =>
                {
                    collect(element);
                });
            }
        }

        private onEnterFrame(interval: number)
        {
            // 每帧清理拾取缓存
            this.pickMap.forEach(item => item.clear());

            this.behaviours.forEach(element =>
            {
                if (element.isVisibleAndEnabled && (this.updateScriptFlag & element.flag))
                    element.update(interval);
            });
        }

        update()
        {
            this._mouseCheckObjects = <any>null;
            this._models = null;
            this._visibleAndEnabledModels = null;
            this._skyBoxs = null;
            this._activeSkyBoxs = null;
            this._directionalLights = null;
            this._activeDirectionalLights = null;
            this._pointLights = null;
            this._activePointLights = null;
            this._spotLights = null;
            this._activeSpotLights = null;
            this._animations = null;
            this._activeAnimations = null;
            this._behaviours = null;
            this._activeBehaviours = null;
        }

        /**
         * 所有 Model
         */
        get models()
        {
            return this._models = this._models || this.getComponentsInChildren(Model);
        }

        /**
         * 所有 可见且开启的 Model
         */
        get visibleAndEnabledModels()
        {
            return this._visibleAndEnabledModels = this._visibleAndEnabledModels || this.models.filter(i => i.isVisibleAndEnabled)
        }

        /**
         * 所有 SkyBox
         */
        get skyBoxs()
        {
            return this._skyBoxs = this._skyBoxs || this.getComponentsInChildren(SkyBox);
        }

        get activeSkyBoxs()
        {
            return this._activeSkyBoxs = this._activeSkyBoxs || this.skyBoxs.filter(i => i.gameObject.globalVisible);
        }

        get directionalLights()
        {
            return this._directionalLights = this._directionalLights || this.getComponentsInChildren(DirectionalLight);
        }

        get activeDirectionalLights()
        {
            return this._activeDirectionalLights = this._activeDirectionalLights || this.directionalLights.filter(i => i.isVisibleAndEnabled);
        }

        get pointLights()
        {
            return this._pointLights = this._pointLights || this.getComponentsInChildren(PointLight);
        }

        get activePointLights()
        {
            return this._activePointLights = this._activePointLights || this.pointLights.filter(i => i.isVisibleAndEnabled);
        }

        get spotLights()
        {
            return this._spotLights = this._spotLights || this.getComponentsInChildren(SpotLight);
        }

        get activeSpotLights()
        {
            return this._activeSpotLights = this._activeSpotLights || this.spotLights.filter(i => i.isVisibleAndEnabled);
        }

        get animations()
        {
            return this._animations = this._animations || this.getComponentsInChildren(Animation);
        }

        get activeAnimations()
        {
            return this._activeAnimations = this._activeAnimations || this.animations.filter(i => i.isVisibleAndEnabled);
        }

        get behaviours()
        {
            return this._behaviours = this._behaviours || this.getComponentsInChildren(Behaviour);
        }

        get activeBehaviours()
        {
            return this._activeBehaviours = this._activeBehaviours || this.behaviours.filter(i => i.isVisibleAndEnabled);
        }

        get mouseCheckObjects()
        {
            if (this._mouseCheckObjects)
                return this._mouseCheckObjects;

            var checkList = this.gameObject.getChildren();
            this._mouseCheckObjects = [];
            var i = 0;
            //获取所有需要拾取的对象并分层存储
            while (i < checkList.length)
            {
                var checkObject = checkList[i++];
                if (checkObject.mouseEnabled)
                {
                    if (checkObject.getComponents(Model))
                    {
                        this._mouseCheckObjects.push(checkObject);
                    }
                    checkList = checkList.concat(checkObject.getChildren());
                }
            }
            return this._mouseCheckObjects;
        }

        _addGameObject(gameobject: GameObject)
        {
            gameobject.components.forEach(element =>
            {
                this._addComponent(element);
            });
            this.dispatch("addToScene", gameobject);
        }

        _removeGameObject(gameobject: GameObject)
        {
            gameobject.components.forEach(element =>
            {
                this._removeComponent(element);
            });

            this.dispatch("removeFromScene", gameobject);
        }

        _addComponent(component: Component)
        {
            this.dispatch("addComponentToScene", component);
        }

        _removeComponent(component: Component)
        {
            this.dispatch("removeComponentFromScene", component);
        }

        private pickMap = new Map<Camera, ScenePickCache>();
        /**
         * 获取拾取缓存
         * @param camera 
         */
        getPickCache(camera: Camera)
        {
            if (this.pickMap.get(camera))
                return this.pickMap.get(camera);
            var pick = new ScenePickCache(this, camera);
            this.pickMap.set(camera, pick);
            return pick;
        }

        /**
         * 获取接收光照渲染对象列表
         * @param light 
         */
        getPickByDirectionalLight(light: DirectionalLight)
        {
            var openlist = [this.gameObject];
            var targets: Model[] = [];
            while (openlist.length > 0)
            {
                var item = openlist.shift();
                if (!item.visible) continue;
                var model = item.getComponent(Model);
                if (model && (model.castShadows || model.receiveShadows)
                    && !model.material.renderParams.enableBlend
                    && model.material.renderParams.renderMode == RenderMode.TRIANGLES
                )
                {
                    targets.push(model);
                }
                item.children.forEach(element =>
                {
                    openlist.push(element);
                });
            }
            return targets;
        }

        /**
         * 获取 可被摄像机看见的 Model 列表
         * @param camera 
         */
        getModelsByCamera(camera: Camera)
        {
            var results = this.visibleAndEnabledModels.filter(i =>
            {
                var model = i.getComponent(Model);
                if (model.selfWorldBounds)
                {
                    if (camera.intersectsBox(model.selfWorldBounds))
                        return true;
                }
                return false;
            });
            return results;
        }
    }
}