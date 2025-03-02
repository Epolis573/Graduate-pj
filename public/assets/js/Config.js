import {ua} from './libs/daijima/ua';
import {gsap, Quart} from "gsap";

export default class {
    constructor(target, targetPackageName) {
        this.init(target, targetPackageName);
        return this.obj;
    }

    getTargetPackage(){
        return this.obj;
    }

    init(target, targetPackageName){
        let obj = target[targetPackageName] = target[targetPackageName] || {};
        this.obj = obj;
        obj.BP = 768;
        obj.ua = ua;
        obj.hasTouch = ("ontouchstart" in window);
        obj.pageYOffset = 0;
        obj.pastPageYOffset = 0;
        obj.scrollWrapper = document.querySelector('.scroll-wrapper');
        obj.colorListForTop = [//màu menu
            '#cca3ac',
            '#2b8088',
            '#d17e34',
            '#1a4f91',
            '#2b2b2b',
            '#22658c',
        ];

        obj.subColorListForTop = [
            '#3d2228',
            '#233938',
            '#504135',
            '#1b2a3e',
            '#141414',
            '#18313f',
        ];

        obj.bgColorListForTop = [
            '#cca3ac',
            '#2b8088',
            '#d17e34',
            '#1a4f91',
            '#4b4b4b',
            '#22658c',
        ];

        obj.directory = '/main/'
        obj.floorList = [
            'pink',
            'turquoise',
            'orange',
            'navy',
            'black',
            'about'
        ];

        obj.getFormatDate = (date) => {
            let dateArray = String(new Date(date)).split(" ");
            return dateArray[1] + " " + dateArray[2] + ", " + dateArray[3];
        };

        // Cách nhau 3 chữ số bằng dấu phẩy
        obj.addComma = (num) => {
            var s = String(num).split('.');
            var ret = String(s[0]).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
            if (s.length > 1) {
                ret += '.' + s[1];
            }
            return ret;
        };

        obj.d2r = function(d){
            return d * Math.PI / 180;
        };

        obj.r2d = function(r){
            return r * 180 / Math.PI;
        };

        obj.random = function(min, max){
            return Math.random() * (max - min) + min;
        };

        obj.checkBG = (target) => {
            if(!obj.background) return;
            if(target.getBoundingClientRect().top <= obj.common.sh){
                obj.background.changeToFooter();
            }else{
                obj.background.changeToNormal();
            }
        };

        obj.checkBottom = () => {
            return (obj.pageYOffset + 1) >= (document.body.clientHeight - obj.common.sh);
        };

        obj.lockHTML = ()=>{
            let html = document.documentElement;
            html.classList.add("hidden");
        };

        obj.unlockHTML = ()=>{
            let html = document.documentElement;
            html.classList.remove("hidden");
        };

        obj.anchorScroll = function(targetY, dr, ease, cb){
            if(!dr) dr = 1;
            if(!ease) ease = Quart.easeInOut;
            let obj = {y:window.pageYOffset};
            gsap.killTweensOf(obj);
            gsap.to(obj, dr, {y:targetY, ease:ease, onUpdate:function(){
                window.scrollTo(0, obj.y);
            }, onComplete:function(){
                if(cb) cb();
            }});
        };

        obj.commonParallax = function(item, targetY, defY, addCode, moveY){
            let top = item.getBoundingClientRect().top;
            if(defY === undefined) defY = 200;

            let speed = (item.dataset.speed != "undefined")  ? item.dataset.speed : "5";
            let difY = (top - targetY) / speed + defY;  //Điểm bắt đầu được hạ xuống 200px theo mặc định.
            if(addCode == undefined) addCode = '';

            if(moveY){
                if(difY < defY - moveY) difY = defY - moveY;
            }

            if(top < targetY) {
                item.style.transform = 'translate3d(0,' + difY + 'px, 0)' + addCode;
                // item.style.top = difY + 'px';
            }
        };

        obj.addZero = function(str){
            if(str.length == 1) str = "0"+str;
            return str;
        };

        obj.getURLParam = (v)=>{
            if(window.location.search.length > 1){
                var query = window.location.search.substring(1);
                var parameters = query.split( '&' );
                var r;

                for( var i = 0; i < parameters.length; i++ )
                {
                    var element = parameters[ i ].split( '=' );
                    var paramName = decodeURIComponent( element[ 0 ] );
                    var paramValue = decodeURIComponent( element[ 1 ] );

                    if(paramName === v) r = paramValue;
                }

                return r;
            }
        };
    }
}
