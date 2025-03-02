export default class {

    constructor(param){
        this._events = {};
    }

    /**
     *  イベントが登録されているか調べます
     *  @param  {string} eventName // イベント名
     */

    hasEventListener(eventName){
        return !!this._events[eventName];
    }

    /**
     *  イベントを登録します
     *  @param  {string}   eventName // イベント名
     *  @param  {function} callback  // 追加する関数
     */
    addEventListener(eventName, callback){
        if (this.hasEventListener(eventName)) {
            var events = this._events[eventName],
                length = events.length,
                i = 0;
            for (; i < length; i++) {
                if (events[i] === callback) {
                    return;
                }
            }

            events.push(callback);
        }else{
            this._events[eventName] = [callback];
        }
    }


    /**
     *  イベントを削除します
     *  @param  {string}   eventName // イベント名
     *  @param  {function} callback  // 削除する関数
     */
    removeEventListener(eventName, callback){
        if (!this.hasEventListener(eventName)) {
            return;
        } else {
            var events = this._events[eventName],
                i = events.length,
                index;

            while (i--) {
                if (events[i] === callback) {
                    index = i;
                }
            }

            events.splice(index, 1);
        }
    }


    /**
     *  イベントを発火します
     *  @param  {string} eventName // イベント名
     *  @param  {object} opt_this  // thisの値
     *  @param           opt_arg   // 引数
     */
    dispatchEvent(eventName, opt_this, opt_arg) {
        if (!this.hasEventListener(eventName)) {
            return;
        } else {
            var events     = this._events[eventName],
                copyEvents = _copyArray(events),
                arg        = _copyArray(arguments),
                length     = events.length,
                i = 0;

            // eventNameとopt_thisを削除
            arg.splice(0, 2);

            for (; i < length; i++) {
                copyEvents[i].apply(opt_this || this, arg);
            }
        }

        function _copyArray(array) {
            var newArray = [],
                i = 0;

            try {
                newArray = [].slice.call(array);
            } catch(e) {
                for (; i < array.length; i++) {
                    newArray.push(array[i]);
                }
            }

            return newArray;
        }
    };
}