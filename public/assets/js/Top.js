import TemplateContents from './TemplateContents';
import TopHero from './TopHero';

import {gsap, Expo, Quart, Quad, Sine, Linear} from "gsap";

export default class extends TemplateContents{
    constructor(param){
        super(param);
    }

    init() {
        super.init();

        this.hero = this.pack.hero = new TopHero(this.pack);
        // this.pack.common.addScrollTarget(this);
        this.pack.common.addEnterframeTarget(this);
    }

    reset(){
        super.reset();

        this.setVars();
        // this.pack.common.addScrollTarget(this);
        this.pack.common.addEnterframeTarget(this);
    }

    destruct(){
        super.destruct();

        // this.pack.common.removeScrollTarget(this);
        this.pack.common.removeEnterframeTarget(this);
    }

    setVars(){
        super.setVars();
        this.enabledWheel = false;
        this.currentFLoor = 0;      //from 0 to 5
        this.selectFloor = undefined;
        this.pastFLoor = this.currentFLoor;

        this.prevWheelTime = Date.now();
        this.prevWheelTime2 = Date.now();
    }

    setDom(){
        super.setDom();
        this.transitionFromHero = document.querySelector('#transition_from_hero');
        this.transitionFromHeroImgs = document.querySelectorAll('#transition_from_hero img');
        this.heroDOM = document.querySelector('#hero');
        this.colorBar = document.querySelector('#hero .color_bar');
        this.colorBars = document.querySelectorAll('#hero .color_bar .bar_child');
        this.bgDOM = document.querySelector('#hero .bg');
        this.bgImgs = document.querySelectorAll('#hero .bg img');
        this.h2Spans = document.querySelectorAll('#hero h2 .item');
        this.floorsList = document.querySelectorAll('#hero .floor_list');
        this.floorListCurrentLi = document.querySelectorAll('#hero .floor_list_current li');

        this.floorListDot = document.querySelector('#hero .floor_list_dot');
        this.floorListInBG = document.querySelector('#hero .bg .floor_list');

        this.canvasContainer = document.querySelector('#hero .canvas_container');
    }

    initEvents(){
        super.initEvents();

        for( let i = 0, len = this.floorListCurrentLi.length; i < len; i++ ){
            let item = this.floorListCurrentLi[i];
            item.addEventListener('click', {handleEvent:this.clickFloorListHandler, id:5 - i, sc:this});
        }
        this.canvasContainer.addEventListener('click', this.clickCanvasContainer.bind(this));
    }

    clickCanvasContainer(event){
        if(this.enabledWheel){
            // trace(this.currentFLoor);
            // if(this.currentFLoor != 0 && this.currentFLoor != 2 && this.currentFLoor != 5) return;
            this.selectFloor = this.currentFLoor;
            let link = this.pack.directory + this.pack.floorList[this.currentFLoor];
            Barba.Pjax.goTo(link);
        }
    }

    clickFloorListHandler(event){
        let sc = this.sc;
        let id = this.id;
        sc.selectFloor = id;
    }

    transitOut(){
        this.enabledWheel = false;
        this.hero.pause();
        let id = this.selectFloor;
        if(id === 5) this.heroDOM.classList.add('hide_for_about');
        else this.heroDOM.classList.add('hide');
        if(this.selectFloor != undefined){
            this.transitionFromHero.classList.add('block');
            if(id !== 5) this.transitionFromHeroImgs[id].classList.add('show');
            gsap.delayedCall(.1, ()=>{
                this.transitionFromHero.classList.add('show');
                this.transitionFromHero.classList.add('show' + Number(id + 1));
            });
        }

        gsap.delayedCall(1, ()=>{
            this.heroDOM.classList.remove('show');
            if(id === 5) this.heroDOM.classList.remove('hide_for_about');
            else this.heroDOM.classList.remove('hide');

            if(this.selectFloor != undefined){
                if(id !== 5) this.transitionFromHeroImgs[id].classList.remove('show');
                this.transitionFromHero.classList.remove('block');
                this.transitionFromHero.classList.remove('show');
                this.transitionFromHero.classList.remove('show' + Number(id + 1));
            }
            this.selectFloor = undefined;
        });
    }

    changeCanvasHoverColor(currentID){
        for( let i = 0, len = 6; i < len; i++ ){
            let id = i + 1;
            this.canvasContainer.classList.remove('color' + id);
        }

        this.canvasContainer.classList.add('color' + currentID);
    }

    start(){
        this.hero.start();

        // this.resetFloor();
        // this.currentFLoor = 0;
        // this.pastFLoor = this.currentFLoor;

        this.changeCanvasHoverColor(this.currentFLoor + 1);
        document.documentElement.style.setProperty('--top_color',this.pack.colorListForTop[this.currentFLoor]);
        document.documentElement.style.setProperty('--top_sub_color',this.pack.subColorListForTop[this.currentFLoor]);
        document.documentElement.style.setProperty('--top_bg_color',this.pack.bgColorListForTop[this.currentFLoor]);

        for( let i = 0, len = this.h2Spans.length; i < len; i++ ){
            let item = this.h2Spans[i];
            item.style.transitionDelay = .5 + Math.random() * .5 + 's';
        }

        this.heroDOM.classList.add('show');

        gsap.delayedCall(1, ()=>{
            this.enabledWheel = true;
        });

        gsap.delayedCall(0.8, ()=>{
            this.floorListCurrentLi[5 - this.currentFLoor].classList.add('current');
        });
    }

    wheel(event, delta){
        // trace(delta);
        let isCancel = false;
        let currentTime = Date.now();
        if(currentTime - this.prevWheelTime < 100 ) isCancel = true;
        this.prevWheelTime = currentTime;

        if(!this.enabledWheel) {
            this.prevWheelTime2 = currentTime;
            return;
        }

        let isCancel2 = false;
        // trace(currentTime, this.prevWheelTime2);
        if(currentTime - this.prevWheelTime2 < 600 ) isCancel2 = true;


        if(isCancel && isCancel2) return;

        // trace(delta, isCancel, isCancel2);

        this.enabledWheel = false;
        this.prevWheelTime2 = currentTime;
        let isSkip = false;
        this.pastFLoor = this.currentFLoor;

        if(delta > 0) this.currentFLoor++;
        else this.currentFLoor--;

        if(this.currentFLoor > 5){
            this.currentFLoor = 5;
            isSkip = true;
        }else if(this.currentFLoor < 0){
            this.currentFLoor = 0;
            isSkip = true;
        }

        if(isSkip){
            this.enabledWheel = true;
        } else{
            this.changeFloor();
        }
    }

    resetFloor(){
        let pastFloorNum = this.currentFLoor + 7;
        let currentFloorNum = 7;
        let currentFloorReverseID = 5;

        //reset hero
        this.hero.updateMaterial(0, 1, true);

        //reset floorlist
        for( let i = 0, len = this.floorsList.length; i < len; i++ ){
            let item = this.floorsList[i];
            item.classList.remove('floor' + pastFloorNum);
            item.classList.add('floor7');
        }

        //floorlist current
        this.setCurrentFloorList(currentFloorReverseID);

        //colorbar current
        this.setCurrentColorbar(currentFloorReverseID);

        //bg current
        this.setCurrentBG(pastFloorNum, currentFloorNum, 0);

        //reset current color
        this.changeCanvasHoverColor(1);
        document.documentElement.style.setProperty('--top_color',this.pack.colorListForTop[0]);
        document.documentElement.style.setProperty('--top_sub_color',this.pack.subColorListForTop[0]);
        document.documentElement.style.setProperty('--top_bg_color',this.pack.bgColorListForTop[0]);
    }

    changeFloor(){
        let pastFloorNum = this.pastFLoor + 7;
        let currentFloorNum = this.currentFLoor + 7;
        let currentFloorReverseID = 5 - this.currentFLoor;

        //hero transition
        this.pack.hero.transition(this.pastFLoor, this.currentFLoor);

        //floorlist transition
        for( let i = 0, len = this.floorsList.length; i < len; i++ ){
            let item = this.floorsList[i];
            item.classList.remove('floor' + pastFloorNum);
            item.classList.add('floor' + currentFloorNum);
        }

        //floorlist current
        this.setCurrentFloorList(currentFloorReverseID);

        //colorbar current
        this.setCurrentColorbar(currentFloorReverseID);

        //bg current
        this.setCurrentBG(pastFloorNum, currentFloorNum, this.currentFLoor);

        //set current color
        this.changeCanvasHoverColor(this.currentFLoor + 1);
        document.documentElement.style.setProperty('--top_color',this.pack.colorListForTop[this.currentFLoor]);
        document.documentElement.style.setProperty('--top_sub_color',this.pack.subColorListForTop[this.currentFLoor]);
        document.documentElement.style.setProperty('--top_bg_color',this.pack.bgColorListForTop[this.currentFLoor]);

        //floorlistDot floorlistBG transition
        let floorListAlpha = .3;
        if(this.currentFLoor === 0) floorListAlpha = .4;
        gsap.fromTo([this.floorListDot, this.floorListInBG], .9, {opacity:.8}, {opacity:floorListAlpha, ease:Sine.easeOut});

        gsap.delayedCall(.9, ()=>{
            this.enabledWheel = true;
        });
    }

    setCurrentFloorList(currentFloorReverseID){
        for( let i = 0, len = this.floorListCurrentLi.length; i < len; i++ ){
            let item = this.floorListCurrentLi[i];
            item.classList.remove('current');
        }
        this.floorListCurrentLi[ currentFloorReverseID ].classList.add('current');
    }

    setCurrentColorbar(currentFloorReverseID){
        for( let i = 0, len = this.colorBars.length; i < len; i++ ){
            let item = this.colorBars[i];
            item.classList.remove('current');
        }
        this.colorBars[ currentFloorReverseID ].classList.add('current');
        if(currentFloorReverseID === 0) this.colorBar.classList.add('select_about');
        else this.colorBar.classList.remove('select_about');
    }

    setCurrentBG(pastFloorNum, currentFloorNum, currentFloor){
        for( let i = 0, len = this.bgImgs.length; i < len; i++ ){
            let item = this.bgImgs[i];
            item.classList.remove('current');
        }
        this.bgImgs[ currentFloor ].classList.add('current');
        this.bgDOM.classList.remove('floor' + pastFloorNum);
        this.bgDOM.classList.add('floor' + currentFloorNum);

    }

    scrollHandler(){

    }


    enterframe(){

    }

    enterframeThinOut(){
        this.hero.enterframeThinOut();
    }

    executeResize() {
        super.executeResize();
    }
}