var log = function() {
    console.log.apply(console, arguments)
}

var e = function(selector) {
    return document.querySelector(selector)
}

var appendHtml = function(element, html) {
	element.insertAdjacentHTML('beforeend', html)
}

var bindEvent = function(element, eventName, callback) {
    element.addEventListener(eventName, callback)
}

var toggleClass = function(element, className) {
    if (element.classList.contains(className)) {
        element.classList.remove(className)
    } else {
        element.classList.add(className)
    }
}

var removeClassAll = function(className) {
    var selector = '.' + className
    var elements = document.querySelectorAll(selector)
    for (var i = 0; i < elements.length; i++) {
        var e = elements[i]
        e.classList.remove(className)
    }
}

var bindAll = function(selector, eventName, callback) {
    var elements = document.querySelectorAll(selector)
    for(var i = 0; i < elements.length; i++) {
        var e = elements[i]
        bindEvent(e, eventName, callback)
    }
}

// find 函数可以查找 element 的所有子元素
var find = function(element, selector) {
    return element.querySelector(selector)
}

// time fix 给你一个数字 给你转换为 00：00 这样的样式
var timeCount = function(n) {
    var intN = parseInt(n)
    var hour
    var min
    // log('intN', intN)
    if(intN < 60) {
        hour = '00'
        min = String(intN)
        // log("< 60", min)
    } else {
        hour = String(intN / 60).slice(0, 1)
        min = String(intN % 60)
        // log("> 60 hour", hour)
        // log("> 60 min", min)
    }
    if (min.length < 2) {
        min = '0' + min
    }
    if (hour.length < 2) {
        hour = '0' + hour
    }
    var time = hour + ':' + min
    return time
}

// 样式切换
var toggleSwitch = function(target, clasName) {
    removeClassAll(clasName)
    target.classList.add(clasName)
}

// 自动获取歌曲总数
var sumOfSongs = function() {
    var selector = e('.songList')
    return selector.dataset.id
}