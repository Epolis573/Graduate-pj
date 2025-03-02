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
        this.enabledWheel = false;
        document.documentElement.classList.remove('enabled_vertical_scroll');
        // this.pack.common.removeScrollTarget(this);
        // this.pack.common.removeEnterframeTarget(this);
    }

    setVars(){
        super.setVars();
        this.scrollX = 0;
        this.easeScrollX = 0;
        this.enabledWheel = false;

        this.aboutLoopTextCnt = 0;
    }

    setDom(){
        super.setDom();
        this.floorDOM = document.querySelector('.floor');
        this.sectionKV = document.querySelector('.floor .section_kv');
        this.textSpans = document.querySelectorAll('.floor .section_kv .text span');
        this.h2Motions = document.querySelectorAll('.floor .h2_motion');
        this.textMotions = document.querySelectorAll('.floor .section .text.font2');
        this.imgMotions = document.querySelectorAll('.floor .img_motion');
        this.imgMotionsChild = document.querySelectorAll('.floor .img_motion img');
        this.materialSection = document.querySelector('.floor .section3');
        this.materialsImg = document.querySelector('.floor .section3 .imgs');
        this.materialsImgs = document.querySelectorAll('.floor .section3 .imgs img');
        for( let i = 0, len = this.materialsImgs.length; i < len; i++ ){
            let item = this.materialsImgs[i];
            item.style.transitionDelay = .15 * i + 's';
        }

        this.nextDOM = document.querySelector('.floor .next');

        this.aboutLoopText = document.querySelector('.floor.floor_about .section1 .bg_img .loop_text');
        this.aboutLoopTextSpan = document.querySelector('.floor.floor_about .section1 .bg_img .loop_text span');

    }

    initEvents(){
        super.initEvents();
    }

    start(isLandingDirectly){
        this.enabledWheel = true;
        document.documentElement.classList.add('enabled_vertical_scroll');
        this.floorDOM.classList.add('show');
        this.pack.header.showLogo();
        this.pack.header.changeGrillColorForFloors();
        gsap.delayedCall(.3, ()=>{
            this.floorDOM.classList.add('start');
        });
        //詳細ページからランディングした時
        if(isLandingDirectly){
            this.floorDOM.style.clipPath = 'inset(0 100vw 0 0)';
            this.floorDOM.style.width = '100vw';
            gsap.delayedCall(.1, ()=>{
                this.floorDOM.classList.add('show_landing_directly');
            });
            gsap.delayedCall(1, ()=>{
                this.floorDOM.style.width = 'inherit';
            })
        }

        for( let i = 0, len = this.textSpans.length; i < len; i++ ){
            let item = this.textSpans[i];
            item.style.transitionDelay = .5 + Math.random() * .5 + 's';
        }
    }

    showAbout(){
        this.sectionKV.style.clipPath = 'inset(0 100vw 0 0)';
        gsap.delayedCall(.1, ()=>{
            this.sectionKV.classList.add('show_from_top');
        });
    }

    wheel(event, delta, isCancel){
        if(!this.enabledWheel) return;
        // trace(delta, isCancel);
        // if(isCancel) return;
        this.scrollX += delta;
        let maxX = this.floorDOM.clientWidth - this.sw;
        if(this.scrollX <= 0) this.scrollX = 0;
        else if(this.scrollX >= maxX) this.scrollX = maxX;

    }

    scrollHandler(){

    }


    enterframe(){

    }

    enterframeThinOut(){
        if(!this.enabledWheel) return;

        if(this.sw >= this.pack.BP) {
            this.easeScrollX += (this.scrollX - this.easeScrollX) * .14285;
            this.floorDOM.style.transform = 'translate3d(' + -this.easeScrollX + 'px, 0, 0)';
        }

        //h2, img
        if(this.sw >= this.pack.BP){
            for( let i = 0, len = this.h2Motions.length; i < len; i++ ){
                let h2 = this.h2Motions[i];
                if(!h2.classList.contains('show')){
                    let text = this.textMotions[i];
                    let currentX = h2.getBoundingClientRect().left;
                    let targetX = this.sw - h2.clientWidth * .8;
                    if(currentX <= targetX) {
                        h2.classList.add('show');
                        if(text) text.classList.add('show');
                    }
                }
            }

            for( let i = 0, len = this.imgMotions.length; i < len; i++ ){
                let img = this.imgMotions[i];
                let imgChild = this.imgMotionsChild[i];
                let clientWidth = img.clientWidth;
                let startX = this.sw;
                let endX = -clientWidth;
                let currentX = img.getBoundingClientRect().left;
                if(currentX <= startX && currentX >= endX){
                    let width = startX + clientWidth;
                    currentX = currentX + clientWidth;
                    let per = 1 - (currentX / width);

                    let imgWidth = imgChild.naturalWidth;
                    let imgHeight = imgChild.naturalHeight;
                    let hSizeRatio = this.sh / imgHeight;
                    imgWidth *= hSizeRatio;

                    let dif = img.clientWidth - imgWidth;
                    let x = dif * per;
                    if(x > 0) x = 0;

                    imgChild.style.transform = 'translate3d(' + x + 'px, 0, 0)'
                }
            }
        }else{
            for( let i = 0, len = this.h2Motions.length; i < len; i++ ){
                let h2 = this.h2Motions[i];
                if(!h2.classList.contains('show')){
                    let text = this.textMotions[i];
                    let currentY = h2.getBoundingClientRect().top;
                    let targetY = this.sh - h2.clientHeight;
                    if(currentY <= targetY) {
                        h2.classList.add('show');
                        if(text) text.classList.add('show');
                    }
                }
            }
        }

        //materials
        if(this.materialSection){
            if(this.sw >= this.pack.BP){
                let materialX = this.materialSection.getBoundingClientRect().left;
                let materialW = this.materialSection.clientWidth;

                let isOnGrill = this.pack.header.checkOnGrillX(materialX, materialW);
                let isOnLogo = this.pack.header.checkOnLogoX(materialX, materialW);

                if(isOnGrill) this.pack.header.addColorClassGrill();
                else this.pack.header.removeColorClassGrill();

                if(isOnLogo) this.pack.header.addColorClassLogo();
                else this.pack.header.removeColorClassLogo();
            }else{
                let materialY = this.materialSection.getBoundingClientRect().top;
                let materialH = this.materialSection.clientHeight;

                let isOnGrill = this.pack.header.checkOnGrillY(materialY, materialH);
                let isOnLogo = this.pack.header.checkOnLogoY(materialY, materialH);

                if(isOnGrill) this.pack.header.addColorClassGrill();
                else this.pack.header.removeColorClassGrill();

                if(isOnLogo) this.pack.header.addColorClassLogo();
                else this.pack.header.removeColorClassLogo();
            }
        }

        if(this.materialsImg && !this.materialsImg.classList.contains('show')){
            if(this.sw >= this.pack.BP){
                let matImgsX = this.materialsImg.getBoundingClientRect().left;
                // let targetX = this.sw - this.materialsImg.clientWidth;
                let targetX = this.swh;
                if(matImgsX <= targetX) this.materialsImg.classList.add('show');
            }else{
                let matImgsY = this.materialsImg.getBoundingClientRect().top;
                // let targetY = this.sh - this.materialsImg.clientHeight;
                let targetY = this.sh * .8;
                if(matImgsY <= targetY) this.materialsImg.classList.add('show');
            }
        }


        if(this.nextDOM && !this.nextDOM.classList.contains('show')){
            if(this.sw >= this.pack.BP){
                let x = this.nextDOM.getBoundingClientRect().left;
                let targetX = this.swh;
                if(x <= targetX) {
                    this.nextDOM.classList.add('show');
                    let h2 = this.nextDOM.querySelector('h2');
                    h2.classList.add('show');
                }

            }else{
                let y = this.nextDOM.getBoundingClientRect().top;
                let targetY = this.shh;
                if(y <= targetY) {
                    this.nextDOM.classList.add('show');
                    let h2 = this.nextDOM.querySelector('h2');
                    h2.classList.add('show');
                }
            }
        }

        if(this.aboutLoopText){
            let spanWidth = this.aboutLoopTextSpan.clientWidth;
            let currentX = spanWidth * (this.aboutLoopTextCnt * .01)
            let y = (this.sw >= this.pack.BP) ? '-50%' : '0';
            this.aboutLoopText.style.transform = 'translate3d(' + (-currentX) + 'px, ' + y + ', 0)';
            this.aboutLoopTextCnt += .2;
            if(this.aboutLoopTextCnt >= 100) this.aboutLoopTextCnt = 0;
        }
    }

    executeResize() {
        super.executeResize();

        if(this.sw < this.pack.BP) {
            this.floorDOM.style.transform = 'translate3d(0, 0, 0)';
        }

    }
}