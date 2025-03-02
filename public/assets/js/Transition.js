import TemplateContents from './TemplateContents';

import {gsap, Expo, Quart, Quad, Sine, Linear} from "gsap";

export default class extends TemplateContents{
    constructor(param){
        super(param);
    }

    init() {
        super.init();

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

    setVars(){
        super.setVars();

        this.hasTransitionDOM = false;
    }

    setDom(){
        super.setDom();
        this.transitionDOM = document.querySelector('#transition_common');
    }

    initEvents(){
        super.initEvents();
    }

    start(){

    }

    transitIn(callback, scope){
        let delay;

        if(this.pack.past === 'top') {
            this.pack.top.transitOut();
            if(this.pack.header.isMenuOpen) delay = 0.1;    //TOPからメニューで下層にいく時、一瞬TOPがはけるのが見えるので少しだけ待つ
            else delay = 1;
        }else{
            this.pack.header.hideLogo();
            this.pack.header.changeGrillColorForTop();
            if(this.pack.header.isMenuOpen) delay = 0;
            else {
                this.transitionDOM.classList.add('block');
                gsap.delayedCall(.1, ()=>{
                    this.transitionDOM.classList.add('show');
                });
                delay = .8;
                this.hasTransitionDOM = true;
            }
        }

        gsap.delayedCall(delay, ()=>{
            if(scope) callback.call(scope);
            else callback();
        });
    }

    transitOut(){
        if(this.pack.current === 'top') this.pack.header.addCurrentToTopBtn();
        else this.pack.header.removeCurrentToTopBtn();

        if(this.pack.current === 'top') this.pack.top.start();

        if(this.pack.past === 'top' && this.pack.current === 'floor_about') this.pack.floors.showAbout();

        if(this.hasTransitionDOM) {
            this.hasTransitionDOM = false;
            this.transitionDOM.classList.add('hide');
            gsap.delayedCall(.8, ()=>{
                this.transitionDOM.classList.remove('hide');
                this.transitionDOM.classList.remove('block');
                this.transitionDOM.classList.remove('show');
            });
        }
    }

    scrollHandler(){

    }


    enterframe(){

    }

    enterframeThinOut(){

    }

    executeResize() {
        super.executeResize();
    }
}