// import Top from './Top';

import {gsap, Expo, Quart, Quad, Sine, Linear} from "gsap";
import Floors from "./Floors";

class BarbaCustom {
    constructor() {
        this.init();
    }

    init(){
        let sc = this;
        this.setVars();
        this.setDom();
        this.initEvents();
        this.initTransition();

        Barba.Pjax.getTransition = function() {
            return sc.transition;
        };

        Barba.Pjax.start();
        Barba.Prefetch.init();
        this.cancelSameLinks();
        // this.preventCheck();
    }

    /*    preventCheck(){
            //TODO この関数内の処理は画面クリックしただけでwindow.historyが追加されていってしまったため、barba.jsに直接追加記述 2020/9/8 by Masayuki Daijima
            let sc = this;
            Barba.Pjax.originalPreventCheck = Barba.Pjax.preventCheck;
            Barba.Pjax.preventCheck = function(evt, element) {
                if(element){
                    // アンカーリンクであり同一ページでなければPjaxを有効に
                    let url = location.protocol + '//' + location.host + location.pathname;
                    let extract_hash = element.href.replace(/#.*$/,"");

                    // if (element.href.startsWith(location.protocol + '//' + location.host)) {}
                    if (element.target === "_blank") return false;
                    if (element.href.indexOf('#') > -1 &&  extract_hash != url ) return true;
                    if (element.href.startsWith('mailto:')) return false;
                }
                return true;
            };
        }
    */
 
    setVars(){
        this.pack = window.DRAFT;
        this.pack.barba = this;
        this.before;
    }

    setDom(){
        this.wrapper = document.querySelector('#barba-wrapper');
        this.barbaContainer = document.querySelector('.barba-container');
        this.transition = document.querySelector('#transition');
        this.scrollWrapper = document.querySelector('.scroll-wrapper');
    }

    initEvents(){
        Barba.Dispatcher.on('newPageReady', this.newPageReadyHandler.bind(this));
        Barba.Dispatcher.on('linkClicked', this.linkClickedHandler.bind(this));
        Barba.Dispatcher.on('initStateChange', this.initStateChangeHandler.bind(this));
        Barba.Dispatcher.on('transitionCompleted', this.transitionCompletedHandler.bind(this));
    }

    newPageReadyHandler(currentStatus, oldStatus, barbaContainer, newPageRawHTML){
        // trace('newPageReady', currentStatus.namespace);

        this.before = this.pack.current;
        let namespace = this.pack.current = currentStatus.namespace;

        if ( Barba.HistoryManager.history.length === 1 ) {  // ファーストビュー
            return; // この時に更新は必要ありません
        }

        // =============================================
        // Googleアナリティクスへ送信
        if (typeof gtag === 'function') {
            gtag('config', window.GA_MEASUREMENT_ID,{
                page_path: window.location.pathname
            });
        }
        // =============================================
    }

    linkClickedHandler(urrentStatus, event){
        // trace('linkClicked');
    }

    initStateChangeHandler(currentStatus){
        let namespace = this.pack.current;
        let pack = this.pack;

        // trace('initStateChange', namespace, Barba.HistoryManager.history.length);

        if ( Barba.HistoryManager.history.length === 1 ) {  // ファーストビュー
            return; // この時に更新は必要ありません
        }

        pack.common.lockScroll = true;

        if(namespace.indexOf('floor') > -1){
            this.pack.floors.destruct();
        }
    }

    transitionCompletedHandler(currentStatus, oldStatus, barbaContainer, newPageRawHTML){
        // trace('transitionCompleted');
        var headerFixed = false;
        // check if 「#」 exists
        if(location.hash){
            var anchor = document.querySelector( location.hash );
            if(anchor){
                var rect = anchor.getBoundingClientRect();
                var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                if(headerFixed){
                    var header = document.getElementById('header');
                    if(header){
                        top = top - header.clientHeight;
                    }
                }
                var top = rect.top + scrollTop;
                window.scrollTo(0,top);
            }else{
                // no anchor, go to top position
                window.scrollTo(0,0);
            }
        }else{
            // no anchor, go to top position
            window.scrollTo(0,0);
        }
    }

    endContentsOutHandler(namespace){

        // if(namespace === 'top'){
        //     this.pack.top.destructAfterContentsOut();
        // }
    }

    initTransition(){
        let sc = this;
        let pack = sc.pack;

        this.transition = Barba.BaseTransition.extend({
            start(){
                this.newContainerLoaded = false;
                this.fadeOutCompleted = false;
                sc.isTransition = true;

                pack.past = pack.current;
                // trace('past', pack.past);

                //oldContainerが隠れるトランジション終了後のcallback
                let callback = ()=>{
                    pack.header.closeMenuExternal();
                    this.fadeOutCompleted = true;
                    this.checkReady();
                    sc.endContentsOutHandler(sc.pack.past);
                };

                pack.header.removeColorClassGrill();
                pack.header.removeColorClassLogo();
                pack.common.startTransitionIn(callback);
                this.contentsOut();
            },

            contentsOut(){

                // this.startSerial()
                //     .then(this.newContainerLoading)
                //     .then(this.initContainer.bind(this));

                this.newContainerLoading.then(this.initContainer.bind(this));
            },

            startSerial(){
                return new Promise(function(resolve){
                    resolve();
                });
            },

            initContainer(){
                if(!this.newContainer) {
                    //SPで遷移後のnewContainerを認識できずにエラーが出る時があるので.2秒待ってもう1回initContainerを呼ぶ
                    TweenMax.delayedCall(.2, this.initContainer.bind(this));
                    return;
                }

                //リンククリック時にnewContainerが表示される場合の処理
                if(this.newContainer) this.newContainer.style.display = "none";

                this.newContainerLoaded = true;
                this.checkReady();
            },

            checkReady(){
                //newContainerの読み込みが完了し、oldContainerが消え切るトランジション完了したかをチェック
                if(this.newContainerLoaded && this.fadeOutCompleted) {
                    this.contentsIn();
                }
            },

            contentsIn(){
                let namespace = pack.current;
                if(this.newContainer){
                    this.newContainer.style.display = "block";
                    this.newContainer.style.visibility = "visible";
                }
                this.done();

                if(namespace.indexOf('floor') > -1){
                    if(pack.floors) pack.floors.reset();
                    else pack.floors = new Floors(pack);
                    pack.floors.start();
                }

                pack.common.setCurrent();
                pack.common.lockScroll = false;

                this.resetScroll();

                //インラインJS
                this.addInlineJs();

                pack.common.resizeHandler();
                gsap.delayedCall(2, function(){
                    //駄目押しリサイズ
                    pack.common.resizeHandler();
                });

                pack.common.startTransitionOut();
                sc.isTransition = false;
            },

            resetScroll(){
                window.scrollTo(0,0);
                document.body.scrollTo(0, 0);       //横スクロール可のDebug mode & PC横幅のタッチデバイス
                pack.common.resetPageYOffset();
            },

            addInlineJs(){
                let js = this.newContainer.querySelector("script");

                if(js != null){
                    let addJs = document.createElement("script");
                    addJs.innerHTML = js.innerHTML;
                    this.newContainer.appendChild(addJs);
                }
            }
        });
    }

    cancelSameLinks(){
        // 現在と同じページのリンクをクリックした場合、リロードなし。
        let links = document.querySelectorAll('a[href]');
        let cbk = function(event) {
            if(event.currentTarget.href === window.location.href) {
                event.preventDefault();
                event.stopPropagation();
            }
        };
        for(let i = 0, len = links.length; i < len; i++) {
            links[i].addEventListener('click', cbk);
        }
    }
}


new BarbaCustom();
