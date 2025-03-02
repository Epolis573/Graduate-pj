/****
 * polyfill
 * requestAnimationFrame
 */

window.requestAnimationFrame = (function() {
    return (
        window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback, time) {
            var time = time ? time: 1000 / 60;
            window.setTimeout(callback, time);
        }
    );
})();


window.cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;