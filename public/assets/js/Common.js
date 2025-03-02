import TemplateContents from './TemplateContents';

import {gsap, Expo, Quart, Quad, Sine, Linear} from "gsap";

import Loading from './Loading';
import Header from './Header';
import Transition from './Transition';
import Top from './Top';
import Floors from './Floors';

export default class extends TemplateContents{
    constructor(param){
        super(param);

        this.debug = this.pack.getURLParam('debug');
        if(this.debug == 'true' || (this.sw >= this.pack.BP && this.pack.hasTouch)){
            document.documentElement.classList.add('enabled_browser_horizontal_scroll');
        }

        this.pack.common = this;
    }

    init() {
        super.init();
    }

    addScrollTarget(target){
        this.scrollTarget = target;
    }

    removeScrollTarget(){
        this.scrollTarget = undefined;
    }

    addEnterframeTarget(target){
        this.enterframeTarget = target;
    }

    removeEnterframeTarget(){
        this.enterframeTarget = undefined;
    }

    setVars(){
        super.setVars();
        this.lockScroll = true;                     //khoá cuộn 

        this.enterframeID;
        this.enterframeIgnoreCnt = 0;

        this.pastPageYOffset = 0;
        this.scrollYOffset = 0;
        this.pastScrollYOffset = 0;

        this.UPDATE_LOAD_COEFF = 0.5;
        this.FPS = 30;
        this.targetInterval = 1000 / this.FPS;
        this.prevTime = Date.now() - this.targetInterval;

        this.touchStartPoint = 0;

        this.prevWheelTime = Date.now();
        this.prevWheelDelta = 0;
    }

    setDom(){
        super.setDom();
        this.scrollWrapper = document.querySelector('.scroll-wrapper');
        this.barbaContainer = document.querySelector('.barba-container');

    }

    initEvents(){
        super.initEvents();

        this.resizeEvent = navigator.userAgent.match(/(iPhone|iPod|iPad)/) ? 'orientationchange' : 'resize';
        this.mousewheelEvent = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';

        this.bindWheelHandler = this.wheelHandler.bind(this);
        this.bindTouchEndHandler = this.touchEndHandler.bind(this);
        this.bindTouchMoveHandler = this.touchMoveHandler.bind(this);
        this.bindTouchStartHandler = this.touchStartHandler.bind(this);

        window.addEventListener("load", this.loadedHandler.bind(this));
        window.addEventListener("DOMContentLoaded", this.DOMContentloadedHandler.bind(this));

        window.addEventListener(this.resizeEvent, this.resizeHandler.bind(this), false);
        window.addEventListener('scroll', this.scrollHandler.bind(this),{passive: false});

        document.addEventListener(this.mousewheelEvent, this.bindWheelHandler, {passive: false});        //for debug
        document.addEventListener('touchstart', this.bindTouchStartHandler, {passive: false});
        document.addEventListener('touchmove', this.bindTouchMoveHandler, {passive: false});
        document.addEventListener('touchend', this.bindTouchEndHandler, {passive: false});

        this.resizeHandler();
        this.enterframe();
    }

    DOMContentloadedHandler(event){

        this.pack.loading = new Loading(this.pack);
        this.pack.loading.addEventListener('completLoading', this.completeLoadingHandler.bind(this));
        this.pack.loading.start();

        this.pack.top = new Top(this.pack);
        this.pack.header = new Header(this.pack);

        this.pack.transition = new Transition(this.pack);

        this.initContainer();
        document.body.style.opacity = 1;
    }

    loadedHandler(event){

    }

    wheelHandler(event) {
        if(this.debug == 'true') return;
        if(this.pack.header.isMenuOpen) return;
        if (this.lockScroll) event.preventDefault();
        let delta = event.deltaY ? (event.deltaY) : event.wheelDelta ? event.wheelDelta : -(event.detail);

        let currentTime = Date.now();
        let currentDelta = Math.abs(delta);
        let isCancel = false;

        // if(currentDelta <= this.prevWheelDelta){
        //     if(currentTime - this.prevWheelTime < 100 ) isCancel = true;
        // }

        if(currentTime - this.prevWheelTime < 50 ) isCancel = true;

        this.prevWheelTime = currentTime;
        this.prevWheelDelta = currentDelta;

        this.pack.top.wheel(event, delta, isCancel);
        if(this.pack.floors) this.pack.floors.wheel(event, delta, isCancel);
    }

    touchStartHandler(event){
        if(this.pack.header.isMenuOpen) return;
        let touches = event.changedTouches[0];
        this.touchStartPoint = touches.clientY;
    }

    touchMoveHandler(event) {
        if(this.pack.header.isMenuOpen) return;
        if (this.lockScroll) event.preventDefault();
    }

    touchEndHandler(event){
        if(this.pack.header.isMenuOpen) return;
        if(!this.touchStartPoint) return;

        let touches = event.changedTouches[0];
        let y = touches.clientY;
        let delta = (y > this.touchStartPoint) ? -1 : 1;

        if(y === this.touchStartPoint) return;
        this.pack.top.wheel(event, delta, false);
        if(this.pack.floors) this.pack.floors.wheel(event, delta, false);
    }

    initContainer() {
        window.scrollTo(0, 0);
        document.body.scrollTo(0, 0);       //Debug cuộn dọc trên pc và touch device
        let namespace = this.barbaContainer.dataset.namespace;
        this.pack.current = namespace;

        if(namespace.indexOf('floor') > -1){
            this.pack.floors = new Floors(this.pack);
        }

        this.setCurrent();
    }

    completeLoadingHandler(event){
        if(this.pack.current.indexOf('floor') > -1){
            this.pack.floors.start(true);
            this.lockScroll = false;
        }else{
            this.pack.top.start();
        }

        this.pack.header.start();
    }

    setCurrent(){
        this.pack.header.setCurrent();
    }

    start(){

    }

    startTransitionIn(callback){
        gsap.delayedCall(.1, ()=>{
            this.pack.transition.transitIn(callback);
        });
    }

    startTransitionOut(){
        this.pack.transition.transitOut();
    }

    resetPageYOffset(){
        // this.pageYOffset = 0;
        // this.scrollYOffset = 0;
    }


    scrollHandler(){

    }


    enterframe(){
        this.enterframeID = window.requestAnimationFrame(this.enterframe.bind(this));

        if(this.enterframeTarget && this.enterframeTarget.enterframe) this.enterframeTarget.enterframe();

        // this.smoothScroll();

        let currentTime = Date.now();
        let updated = false;
        while (currentTime - this.prevTime > this.targetInterval) {

            updated = true;
            this.prevTime += this.targetInterval;
            const now = Date.now();
            const updateTime = now - currentTime;
            if (updateTime > this.targetInterval * this.UPDATE_LOAD_COEFF) {
                // overloaded
                if (this.prevTime < now - this.targetInterval) {
                    // do not accumulate too much
                    this.prevTime = now - this.targetInterval;
                }
                break;
            }
        }

        if (updated) {
            if(this.enterframeTarget) this.enterframeTarget.enterframeThinOut();
            if(this.pack.loading && this.pack.loading.enabled) this.pack.loading.enterframeThinOut();
            if(this.pack.header) this.pack.header.enterframeThinOut();
            if(this.pack.floors) this.pack.floors.enterframeThinOut();
        }

        if(this.enterframeIgnoreCnt % 90 === 0){
            //(1 execution per 90 frames)
            this.resizeHandler();
        }

        //Vị trí cuộn trước đó (được chỉ định sau khi hoàn tất quá trình xử lý)
        this.pastPageYOffset = this.pack.pastPageYOffset = this.pack.pageYOffset;

        this.enterframeIgnoreCnt++;
    }

    enterframeThinOut(){

    }

    executeResize() {
        super.executeResize();
        document.documentElement.style.setProperty('--common_stage_height', this.sh + 'px');

        if(this.debug == 'true') return;

        if(this.sw >= this.pack.BP && this.pack.hasTouch){
            document.documentElement.classList.add('enabled_browser_horizontal_scroll');
        }else{
            document.documentElement.classList.remove('enabled_browser_horizontal_scroll');
        }
    }
}