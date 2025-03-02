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

        this.isMenuOpen = false;
        this.slideCnt = 0;
        this.changeCntNum = 120;
        this.currentSlide = 0;
        this.SLIDE_LEN = 6;

        this.grillX, this.grillW, this.logoX, this.logoW;
    }

    setDom(){
        super.setDom();
        this.logoDOM = document.querySelector('header .logo');
        this.grillDOM = document.querySelector('header .grill');
        this.menuDOM = document.querySelector('header .menu');
        this.menuImgs = document.querySelectorAll('header .menu .imgs img');
        this.mainNavLi = document.querySelectorAll('header .menu .main_nav li');
        this.menuToTopBtn = document.querySelector('header .menu .to_top_btn');
    }

    initEvents(){
        super.initEvents();

        this.grillDOM.addEventListener('click', this.clickGrillHandler.bind(this));

/*        for( let i = 0, len = this.mainNavLi.length; i < len; i++ ){
            let item = this.mainNavLi[i];
            item.addEventListener('click', ()=>{
               this.pack.top.selectFloor = i;
            });
        }*/

        if(!this.pack.hasTouch){
            for( let i = 0, len = this.mainNavLi.length; i < len; i++ ){
                let item = this.mainNavLi[i];
                let id = 5 - i;
                item.addEventListener('mouseover', {handleEvent:this.mouseOverMainNavLiHandler, id: id, id2: i, sc:this});
                item.addEventListener('mouseout', {handleEvent:this.mouseOutMainNavLiHandler, id: id, id2: i, sc:this});
            }
        }
    }

    setCurrent(){
        let currentID;
        let namespace = this.pack.current;
        if(namespace === 'top') currentID = -1;
        else if(namespace === 'floor7') currentID = 5;
        else if(namespace === 'floor8') currentID = 4;
        else if(namespace === 'floor9') currentID = 3;
        else if(namespace === 'floor10') currentID = 2;
        else if(namespace === 'floor11') currentID = 1;
        else currentID = 0;

        for( let i = 0, len = this.mainNavLi.length; i < len; i++ ){
            let item = this.mainNavLi[i];
            item.classList.remove('current');
        }

        if(currentID === -1) return;
        this.mainNavLi[currentID].classList.add('current');
    }

    resetMenuImgs(){
        for( let i = 0, len = this.menuImgs.length; i < len; i++ ){
            let item = this.menuImgs[i];
            item.classList.remove('show');
        }
    }

    mouseOverMainNavLiHandler(event){
        let id = this.id;
        let id2 = this.id2;
        let sc = this.sc;

        sc.resetMenuImgs();
        sc.menuImgs[id].classList.add('show');
        sc.mainNavLi[id2].classList.add('hover');
        sc.currentSlide = id;
        sc.slideCnt = 0;
    }

    mouseOutMainNavLiHandler(event){
        let id = this.id;
        let id2 = this.id2;
        let sc = this.sc;
        sc.mainNavLi[id2].classList.remove('hover');
    }

    clickGrillHandler(event){
        if(this.isMenuOpen){
            this.closeMenu();
        }else{
            this.openMenu();
        }
    }

    openMenu(){
        this.menuDOM.classList.add('block');
        this.grillDOM.classList.add('close');
        gsap.delayedCall(.1, ()=>{
            this.menuDOM.classList.add('show');
        });
        document.documentElement.classList.add("lock");
        this.isMenuOpen = !this.isMenuOpen;
    }

    closeMenu(){
        this.menuDOM.classList.add('hide');
        this.grillDOM.classList.remove('close');
        gsap.delayedCall(.8, ()=>{
            this.menuDOM.classList.remove('hide');
            this.menuDOM.classList.remove('show');
            this.menuDOM.classList.remove('block');
        });
        document.documentElement.classList.remove("lock");
        this.isMenuOpen = !this.isMenuOpen;
    }

    showLogo(){
        this.logoDOM.classList.add('show');
    }

    hideLogo(){
        this.logoDOM.classList.remove('show');
    }

    changeGrillColorForFloors(){
        this.grillDOM.classList.add('white');
    }

    changeGrillColorForTop(){
        this.grillDOM.classList.remove('white');
    }

    addColorClassGrill(){
        this.grillDOM.classList.add(this.pack.current);
    }

    removeColorClassGrill(){
        this.grillDOM.classList.remove(this.pack.current);
    }

    addColorClassLogo(){
        this.logoDOM.classList.add(this.pack.current);
    }

    removeColorClassLogo(){
        this.logoDOM.classList.remove(this.pack.current);
    }

    checkOnGrillX(x, w){
        let bool;
        if(x <= this.grillX + this.grillW && x >= this.grillX + this.grillW - w) bool = true;
        else bool = false;
        return bool;
    }

    checkOnGrillY(y, h){
        let bool;
        if(y <= this.grillY + this.grillH && y >= this.grillY + this.grillH - h) bool = true;
        else bool = false;
        return bool;
    }

    checkOnLogoX(x, w){
        let bool;
        if(x <= this.logoX + this.logoW && x >= this.logoX + this.logoW - w) bool = true;
        else bool = false;
        return bool;
    }

    checkOnLogoY(y, h){
        let bool;
        if(y <= this.logoY + this.logoH && y >= this.logoY + this.logoH - h) bool = true;
        else bool = false;
        return bool;

    }

    start(){
        this.grillDOM.classList.add('show');
        if(this.pack.current === 'top') this.addCurrentToTopBtn();
    }

    addCurrentToTopBtn(){
        this.menuToTopBtn.classList.add('current');
    }

    removeCurrentToTopBtn(){
        this.menuToTopBtn.classList.remove('current');
    }

    closeMenuExternal(){
        if(this.isMenuOpen) this.closeMenu();
    }

    scrollHandler(){

    }

    slideImg(){
        this.slideCnt++;
        if(this.slideCnt >= this.changeCntNum){
            this.slideCnt = 0;
            if(this.currentSlide == this.SLIDE_LEN - 1) this.currentSlide = 0;
            else this.currentSlide++;
            this.resetMenuImgs();
            this.menuImgs[this.currentSlide].classList.add('show');
        }
    }

    enterframe(){

    }

    enterframeThinOut(){
        if(this.isMenuOpen){
            this.slideImg();
        }
    }

    executeResize() {
        super.executeResize();

        this.grillX = this.grillDOM.getBoundingClientRect().left;
        this.grillY = this.grillDOM.getBoundingClientRect().top;
        this.grillW = this.grillDOM.clientWidth;
        this.grillH = this.grillDOM.clientHeight;

        this.logoX = this.logoDOM.getBoundingClientRect().left;
        this.logoY = this.logoDOM.getBoundingClientRect().top;
        this.logoW = this.logoDOM.clientWidth;
        this.logoH = this.logoDOM.clientHeight;
    }
}