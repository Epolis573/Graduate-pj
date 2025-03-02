import TemplateContents from './TemplateContents';

import {gsap} from "gsap";

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
        this.enabled = false;
        this.perCnt = 0;
        this.completedShowMotion = false;
    }

    setDom(){
        super.setDom();
        this.loadingDOM = document.querySelector('#loading');
        this.textSpans = document.querySelectorAll('#loading .text span');
        this.perDOM = document.querySelector('#loading .per');
    }

    initEvents(){
        super.initEvents();
    }

    start(){
        for( let i = 0, len = this.textSpans.length; i < len; i++ ){
            let item = this.textSpans[i];
            item.style.transitionDelay = .5 + Math.random() * .5 + 's';
        }

        gsap.delayedCall(.3, ()=>{
            this.enabled = true;
            this.loadingDOM.classList.add('show');
        });

        gsap.delayedCall(2.5, ()=>{
           this.completedShowMotion = true;
        });
    }

    endLoading(){
        this.enabled = false;

        this.loadingDOM.classList.add('hide');
        gsap.delayedCall(1.2, ()=>{
            this.loadingDOM.remove();
        });

        gsap.delayedCall(0.8, ()=>{
            this.dispatchEvent('completLoading');
        });
    }

    scrollHandler(){

    }


    enterframe(){

    }

    enterframeThinOut(){
        if(this.perCnt < this.pack.hero.loadPer) this.perCnt++;
        if(this.perCnt >= 100) this.perCnt = 100;
        this.perDOM.innerText = this.perCnt + '%';
        if(this.perCnt === 100 && this.completedShowMotion) this.endLoading();
    }

    executeResize() {
        super.executeResize();
    }
}