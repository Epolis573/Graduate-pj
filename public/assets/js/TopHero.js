import TemplateContents from './TemplateContents';


import GUI from 'lil-gui';

import {gsap, Expo, Quart, Quad, Sine, Linear} from "gsap";
import * as THREE from 'three';
import vertex from './shaders/vertex.glsl';
import fragment from './shaders/frag.glsl';

import noise from './shaders/img/noise.png';

const ambientIntensity = 0.9,
    ambientColor = 0xFFFFFF,
    directionalIntensity = 0.39,
    directionalColor = 0xFFFFFF,
    directionalLightX = 100,
    directionalLightY = 0,
    directionalLightZ = 0.866;

export default class extends TemplateContents{
    constructor(param){
        super(param);
    }

    init() {
        super.init();

        this.dr = Number(this.pack.getURLParam('dr')) || 0.9;
        this.hasController = Number(this.pack.getURLParam('has_controller'));

        // this.devicePixelRatio = window.devicePixelRatio || 1;
        // this.devicePixelRatio = Math.min(2, this.devicePixelRatio);

        this.canvasContainer = document.querySelector('#hero .canvas_container');
        this.canvas = document.createElement("canvas");
        this.canvasContainer.appendChild(this.canvas);
        this.sw = this.canvasContainer.clientWidth;
        this.sh = this.canvasContainer.clientHeight;
        this.canvas.width = this.sw;
        this.canvas.height = this.sh;

        this.initWebGL();
        this.initMesh();
        // if(this.hasController == '1') this.setGUI();

        // this.pack.common.addScrollTarget(this);
        // this.pack.common.addEnterframeTarget(this);
    }

    reset(){
        super.reset();

        this.setVars();
        // this.pack.common.addScrollTarget(this);
        // this.pack.common.addEnterframeTarget(this);
    }

    destruct(){
        super.destruct();

        // this.pack.common.removeScrollTarget(this);
        // this.pack.common.removeEnterframeTarget(this);
    }

    //for debug
    setGUI() {
        const gui = new GUI();
        gui.width = 414;
        gui.left = 0;
        gui.domElement.style.zIndex = 2000;
        // gui.close();

        const PROPS = {
            progress: 0,
            noiseScale: this.noiseScale,
        }

        gui.add( PROPS, 'progress', 0, 2.5 ).onChange(value => {
            this.material.uniforms.progress.value = value;
        });

        gui.add( PROPS, 'noiseScale', 0, 1 ).onChange(value => {
            this.material.uniforms.noiseScale.value = value;
        });
    }

    setVars(){
        super.setVars();

        this.loadCnt = 0;
        this.loadPer = 0;
        this.enabled = false;

        this.imgDirectory = 'assets/img/common/kv/'
        this.imgDirectorySP = 'assets/img/common/kv/sp/'

        this.pastFloor = 0;
        this.currentFloor = 1;
        this.point = {x:window.innerWidth * .5, y:window.innerHeight * .5};

        this.noiseScale = .45;
        this.targetColors = [
            new THREE.Vector3(0.800, 0.639, 0.674),       //#cca3ac
            new THREE.Vector3(0.168, 0.501, 0.533),       //#2b8088
            new THREE.Vector3(0.819, 0.494, 0.203),       //#d17e34
            new THREE.Vector3(0.101, 0.309, 0.568),       //#1a4f91
            new THREE.Vector3(0.168),                           //#2b2b2b
            new THREE.Vector3(0.133, 0.396, 0.549),       //#22658c
        ];

        this.mapListPC = [
            new THREE.TextureLoader().load(this.pack.directory + this.imgDirectory + 'pink_kv.webp', this.loadedImgHandler.bind(this)),
            new THREE.TextureLoader().load(this.pack.directory + this.imgDirectory + 'turquoise_kv.webp', this.loadedImgHandler.bind(this)),
            new THREE.TextureLoader().load(this.pack.directory + this.imgDirectory + 'orange_kv.webp', this.loadedImgHandler.bind(this)),
            new THREE.TextureLoader().load(this.pack.directory + this.imgDirectory + 'navy_kv.webp', this.loadedImgHandler.bind(this)),
            new THREE.TextureLoader().load(this.pack.directory + this.imgDirectory + 'black_kv.webp', this.loadedImgHandler.bind(this)),
            new THREE.TextureLoader().load(this.pack.directory + this.imgDirectory + 'about_kv.webp', this.loadedImgHandler.bind(this)),
        ];

        this.mapListSP = [
            new THREE.TextureLoader().load(this.pack.directory + this.imgDirectorySP + 'pink_kv.webp', this.loadedImgHandler.bind(this)),
            new THREE.TextureLoader().load(this.pack.directory + this.imgDirectorySP + 'turquoise_kv.webp', this.loadedImgHandler.bind(this)),
            new THREE.TextureLoader().load(this.pack.directory + this.imgDirectorySP + 'orange_kv.webp', this.loadedImgHandler.bind(this)),
            new THREE.TextureLoader().load(this.pack.directory + this.imgDirectorySP + 'navy_kv.webp', this.loadedImgHandler.bind(this)),
            new THREE.TextureLoader().load(this.pack.directory + this.imgDirectorySP + 'black_kv.webp', this.loadedImgHandler.bind(this)),
            new THREE.TextureLoader().load(this.pack.directory + this.imgDirectorySP + 'about_kv.webp', this.loadedImgHandler.bind(this)),
        ];

        this.sw = window.innerWidth;
        this.sh = window.innerHeight;
        this.swh = this.sw / 2;
        this.shh = this.sh / 2;

        this.TEXURE_HEIGHT = 1200;

        if(this.sw >= this.pack.BP){
            this.mapList = this.mapListPC;
            this.TEXURE_WIDTH = 1800;
        }else{
            this.mapList = this.mapListSP;
            this.TEXURE_WIDTH = 1000;
        }
    }

    loadedImgHandler(){
        this.loadCnt++;
        this.loadPer = this.loadCnt / 12 * 100;
    }

    setDom(){
        super.setDom();
    }

    initEvents(){
        super.initEvents();

        this.bindPointermoveHandler = this.pointerMoveHandler.bind(this);
        //マウスオーバーとドラッグ処理
        document.addEventListener(this.pack.hasTouch ? 'touchmove' : 'mousemove', this.bindPointermoveHandler,{passive : false});
    }

    pointerMoveHandler(event){
        let x, y;
        let w = this.sw;
        let h = this.sh;

        if(event.type.indexOf('touch') == 0) {
            let touches = event.changedTouches[0];
            x = touches.clientX;
            y = touches.clientY;
        }else{
            x = event.clientX;
            y = event.clientY;
        }

        this.point.x = x - this.swh;
        this.point.y = y - this.shh;
    }

    start(){
        this.enabled = true;
        // if(this.hasController != '1') this.transitionIn();
    }

    pause(){
        this.enabled = false;
    }

    transition(id1, id2){
        const dr = this.dr;
        const ease = Quad.easeInOut;
        this.pastFloor = id1;
        this.currentFloor = id2;
        this.material.uniforms.random.value = Math.random();
        this.material.uniforms.progress.value = 0;
        this.material.uniforms.uTexture.value = this.mapList[id1];
        this.material.uniforms.uTexture2.value = this.mapList[id2];
        this.material.uniforms.targetColor.value = this.targetColors[id1];
        this.material.uniforms.targetColor2.value = this.targetColors[id2];
        gsap.to(this.material.uniforms.progress, dr, {value:2.5, ease:ease});
    }

    updateMaterial(id1, id2, isReset){
        this.pastFloor = id1;
        this.currentFloor = id2;

        this.material.uniforms.uTexture.value = this.mapList[id1];
        this.material.uniforms.uTexture2.value = this.mapList[id2];
        this.material.uniforms.targetColor.value = this.targetColors[id1];
        this.material.uniforms.targetColor2.value = this.targetColors[id2];

        if(isReset){
            this.material.uniforms.progress.value = 0;
        }
    }

/*
    transitionIn(){
        const dr = this.dr;
        const delay = 1.5;
        const ease = Sine.easeInOut;
        this.material.uniforms.random.value = Math.random();
        this.material.uniforms.progress.value = 0;
        this.material.uniforms.uTexture.value = this.mapList[0];
        this.material.uniforms.uTexture2.value = this.mapList[1];
        this.material.uniforms.targetColor.value = this.targetColors[0];
        this.material.uniforms.targetColor2.value = this.targetColors[1];
        gsap.to(this.material.uniforms.progress, dr, {delay: delay, value:2.5, ease:ease, onComplete:()=>{
            this.transitionOut();
        }});
    }

    transitionOut(){
        const dr = this.dr;
        const delay = 1.5;
        const ease = Sine.easeInOut;
        this.material.uniforms.random.value = Math.random();
        this.material.uniforms.progress.value = 0;
        this.material.uniforms.uTexture.value = this.mapList[1];
        this.material.uniforms.uTexture2.value = this.mapList[0];
        this.material.uniforms.targetColor.value = this.targetColors[1];
        this.material.uniforms.targetColor2.value = this.targetColors[0];

        gsap.to(this.material.uniforms.progress, dr, {delay:delay, value:2.5, ease:ease, onComplete:()=>{
                this.transitionIn();
            }});
    }
*/

    initWebGL() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha : true,
            antialias : true
        });
        // this.renderer.setPixelRatio(window.devicePixelRatio);
        let devicePixelRatio = window.devicePixelRatio;
        devicePixelRatio = Math.min(devicePixelRatio, 2);
        // this.renderer.setPixelRatio(1);
        this.renderer.setPixelRatio(devicePixelRatio);
        this.renderer.setSize(this.sw, this.sh);
        this.renderer.autoClear = false;

        this.scene = new THREE.Scene();

        this.fieldOfView = 45;
        this.defCameraZ = this.sh / Math.tan(this.fieldOfView * Math.PI / 360) / 2;
        this.cameraZ = this.defCameraZ;
        this.camera = new THREE.PerspectiveCamera(this.fieldOfView, this.sw / this.sh, 1, -this.defCameraZ);
        this.camera.position.z = this.defCameraZ;

        // 平行光源
        this.directionalLight = new THREE.DirectionalLight(directionalColor, directionalIntensity);
        this.directionalLight.position.set(directionalLightX, directionalLightY, directionalLightZ);
        this.scene.add(this.directionalLight);

        // 環境光源
        this.ambientLight = new THREE.AmbientLight(ambientColor, ambientIntensity);
        this.scene.add(this.ambientLight);

/*
        //　スポットライト
        this.spotLight = new THREE.SpotLight(0xFFFFFF, .4, 5000, Math.PI / 4, 0);
        // ライトに影を有効にする
        this.spotLight.castShadow = true;
        this.spotLight.shadow.camera.near = 8;
        this.spotLight.shadow.camera.far = 250;
        this.spotLight.shadow.camera.fov = 30;
        this.scene.add(this.spotLight);
        this.spotLight.shadow.mapSize.width = 2048 * 2;
        this.spotLight.shadow.mapSize.height = 2048 * 2;
        this.spotLight.position.set(-1000, 1300, -1300);
*/

        // this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    }


    initMesh(){
        let geometry = new THREE.PlaneGeometry( 2, 2);

        let material = this.material = new THREE.ShaderMaterial({
            uniforms: {
                resolution: {type:'v2', value: new THREE.Vector2(this.sw, this.sh)},
                textureResolution: {type:'v2', value: new THREE.Vector2(this.TEXURE_WIDTH,this.TEXURE_HEIGHT)},
                uTexture: { value: this.mapList[0] },
                uTexture2: { value: this.mapList[1] },
                uNoise: { value: new THREE.TextureLoader().load(noise) },
                random: {type:'f', value: Math.random()},
                targetColor: {type:'v3', value: this.targetColors[0]},
                targetColor2: {type:'v3', value: this.targetColors[1]},
                progress: {type:'f', value: 0},
                noiseScale: {type:'f', value: this.noiseScale},
                isUpward: {type:'f', value: 1.0},   //1.0(上方向) or 0.0（下方向）
            },
            vertexShader: vertex,
            fragmentShader: fragment,
            transparent: true,
            depthTest: false, // no depth test
            // blending: THREE.AdditiveBlending,
        });

        let plane = new THREE.Mesh( geometry, material );
        plane.renderOrder = -2; // rendering first
        this.scene.add( plane );
    }

    scrollHandler(){

    }

    render(){
        // カメラの自動移動
        // this.camera.position.x = 1000 * Math.sin(Date.now()*.001);
        // this.camera.position.y = 500 * Math.sin(Date.now()*.001);
        // this.camera.position.z = 100 * Math.cos(Date.now()*.001);

        // this.camera.lookAt(new THREE.Vector3(0, 0, 0));

        this.renderer.render(this.scene, this.camera);
    }

    enterframe(){

    }

    enterframeThinOut(){
        // this.time += this.speed;
        // this.material.uniforms.time.value = this.time % Math.PI / Math.PI;
        // this.controls.update();

        if(!this.enabled) return;
        this.render();
    }

    executeResize() {
        if(!this.canvas) return;
        this.sw = this.canvasContainer.clientWidth;
        this.sh = this.canvasContainer.clientHeight;
        this.swh = this.sw / 2;
        this.shh = this.sh / 2;


        if(!this.canvas) return;

        this.canvas.width = this.sw;
        this.canvas.height = this.sh;

        if(!this.camera) return;

        this.cameraZ = this.defCameraZ;
        this.camera.position.z = this.cameraZ;

        this.camera.aspect = this.sw / this.sh;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.sw, this.sh);

        if(this.sw >= this.pack.BP){
            this.mapList = this.mapListPC;
            this.TEXURE_WIDTH = 1800;
        }else{
            this.mapList = this.mapListSP;
            this.TEXURE_WIDTH = 1000;
        }
        if(this.material) {
            this.material.uniforms.resolution.value = new THREE.Vector2(this.sw, this.sh);
            this.material.uniforms.textureResolution.value = new THREE.Vector2(this.TEXURE_WIDTH, this.TEXURE_HEIGHT);
            this.updateMaterial(this.pastFloor, this.currentFloor);
        }
    }
}