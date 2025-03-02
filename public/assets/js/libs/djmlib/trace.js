window.trace = function(){
    if(window.console && console.log && console.log.apply) console.log.apply(console, arguments);
}