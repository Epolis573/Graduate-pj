import EventDispatcher from './libs/daijima/EventDispatcher';

export default class TemplateContents extends EventDispatcher {
    constructor(param){
        super();

        if(param) this.pack = param;
        this.init();
    }

    init(skipInitEvents){

        this.sw, this.sh;
        this.enterframeID;

        this.setVars();
        this.setDom();
        this.bindResizeHandler = this.resizeHandler.bind(this);
        this.hasTouch = ("ontouchstart" in window);
        this.resizeEvent = this.hasTouch ? 'orientationchange' : 'resize';

        if(skipInitEvents) return;
        this.initEvents();
    }

    reset(){
        this.cnt = 0;

        this.setDom();
        this.initEvents();
    }

    destruct(){
        window.cancelAnimationFrame(this.enterframeID);
        window.removeEventListener(this.resizeEvent, this.bindResizeHandler);
    }

    setVars(){

    }

    setDom(){

    }

    initEvents(){
        window.addEventListener(this.resizeEvent, this.bindResizeHandler);

        if(!this.hasTouch){

        }

        this.resizeHandler();
    }


    start(){

    }

    resizeHandler(event){
        if(event !== undefined && event.type === "orientationchange"){
            this.executeResize();
            setTimeout(() => {
                this.executeResize();
            }, 100);
        }else{
            this.executeResize();
        }
    }

    executeResize(){
        this.sw = window.innerWidth;
        this.sh = window.innerHeight;
        this.swh = this.sw / 2;
        this.shh = this.sh / 2;

    }
}