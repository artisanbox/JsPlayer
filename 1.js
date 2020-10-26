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

var ShowTime = function(cur, dur) {
    this.cur = e(cur)
    this.dur = e(dur)
}

ShowTime.prototype.setCur = function(t) {
    this.cur.innerHTML = timeCount(t)
}

ShowTime.prototype.setDur = function(t) {
    this.dur.innerHTML = timeCount(t)
}

// 修改 进度条长度
var LoadProcess = function(name) {
    this.name = e(name)
}

LoadProcess.prototype.Set = function(time) {
    var n = time + '%'
    this.name.style.width = n
}

// 显示 loading 数字 以及 进度条
var TimeProcess = function(cur, dur) {
    this.cur = cur
    this.dur = dur
}

TimeProcess.prototype.getLoadingNum = function() {
    var t = (this.cur / this.dur) * audio.getCurSong().duration
    return t
}

TimeProcess.prototype.getShowLine = function() {
    var t = (this.cur / this.dur) * 100
    return t
}

// 绑定事件的类
var Bind = function(c) {
    this.c = c
}

Bind.prototype.bindCli = function(callBack) {
    var selectorBegin = this.c
    bindAll(selectorBegin, 'click', function(event) {
        if(audio.getCurSong().readyState === 4) {
            var target = event.target
            log('click play or pause')
            toggleSwitch(target, 'hide')
            callBack()
        }
    })
}

// 歌曲的类
var Songs = function(id) {
    // this.song = song
    this.curId = id
    // this.sumOfSongs 
}

Songs.prototype.getPreSong = function() {
    var selector = '#id-audio-player-' + String(this.preId())
    var target = e(selector)
    return target
}

Songs.prototype.preId = function() {
    var index = this.curId
    var maxIndex = sumOfSongs() - 1
    var preIndex
    if(index == 0) {
        preIndex = maxIndex
    } else {
        preIndex = index - 1
    }
    return preIndex
}

Songs.prototype.setPreId = function() {
    this.curId = this.preId()
}

Songs.prototype.nextId = function() {
    var index = this.curId
    var maxIndex = sumOfSongs() - 1
    var nextIndex
    if(index == maxIndex) {
        nextIndex = 0
    } else {
        nextIndex = index + 1
    }
    return nextIndex
}

Songs.prototype.setNextId = function() {
    this.curId = this.nextId()
}

Songs.prototype.getCurSong = function() {
    var selector = '#id-audio-player-' + String(this.curId)
    var target = e(selector)
    return target
}

Songs.prototype.getNextSong = function() {
    var selector = '#id-audio-player-' + String(this.nextId())
    var target = e(selector)
    return target
}

Songs.prototype.stop = function() {
    this.getCurSong().pause()
    this.getCurSong().currentTime = 0
}

// 利用 localStorage 进行存储
var songNew = function(src) {
    var t = {
        src: src,
    }
    return t
}

var songsTemplate = function(song) {
    // log("songsTemplate sumOfSongs", sumOfSongs())
    // log("songsTemplate getMaxId", getMaxId())
    var src = song.src
    var id = sumOfSongs()
    t = `
    <audio class="song" id="id-audio-player-${id}" preload="auto">
        <source class="gen" src="${src}">
    </audio>
    `
    return t
}

// 删除歌曲 2020/09/26 10:30
// 1，在 html 页面中删去某个音乐
// 2，获取 html 中所有 src 
// 3，把 [{},{}] 存入 localStorage 中
// 4，重新加载 数据，在 html 中显示出来
// var deleteSong = function(id) {
//     var songList = []
//     var selector = `#id-audio-player-${id}` 
//     var songId = document.querySelector(selector)
//     log("songId", songId)
//     songId.remove()

//     var songSrc = document.querySelectorAll('.gen')
//     for(var i = 0; i < songSrc.length; i++) {
//         var src = songSrc[i].src
//         log("src", src)
//         var data = {
//             src: src
//         }
//         songList.push(data)
//     }

//     // log("songList", songList)
//     var selector = e('.songList')
//     selector.dataset.id = "0"
//     saveSongs(songList)
//     insertSong(songList)
//     this.curId -= 1;
//     audio.getCurSong.play();
// }

var appendSong = function(s) {
    var songList = e('.songList')
    var songs = songsTemplate(s)
    appendHtml(songList, songs)
    // 修改 html 页面的所有音乐个数
    var selector = e('.songList')
    var sum = parseInt(selector.dataset.id) + 1
    selector.dataset.id = String(sum)
    // log("id", selector.dataset.id)
}

// 在 html songList 页面后面新增加
var insertSong = function(src) {
    var songList = e('.songList')
    songList.innerHTML = ''
    for(var i = 0; i < src.length; i++) {
        var s = src[i]
        appendSong(s)
    }
} 

// 获取 localStorage 里的所有 songs
var loadSongs = function() {
    var songStr = localStorage.songs
    // 第一次读取的时候，结果是 undefined
    // 所以需要设置为空数组 '[]'
    // 否则 JSON.parse 就报错了
    if (songStr == undefined) {
        songStr = '[]'
    }
    var songList = JSON.parse(songStr)
    return songList
}

// 保存一个 songsList
var saveSongs = function(songList) {
    localStorage.songs = JSON.stringify(songList)
}

// 保存一个 song
var saveSong = function(music) {
    // 获取到所有 songs
    var songList = loadSongs()
    // 向 songs 的 list 中 push 新的 music
    songList.push(music)
    saveSongs(songList)
}

// 在 localStorage 里获取数据后，添加后 songList 里面
var showSongs = function() {
    var Songs = loadSongs()
    insertSong(Songs)
}

// 获取歌曲的个数
var storageMaxId = function() {
    var songs = loadSongs()
    return songs.length
}

// 添加歌曲 （src 是字符串）
var addSongs = function(src) {
    var s = songNew(src)
    // 在 localStorage 中保存
    saveSong(s)
    // 在 html 页面中显示出来
    appendSong(s)
}

// 获取网易云音乐链接函数
var dududu = function(n) {
    return `http://music.163.com/song/media/outer/url?id=${n}.mp3`
}

// 实列化
var loadingLine = new ShowTime('.current', '.duration')
var orange = new LoadProcess('.orange')
var begin = new Bind('.begin')
var pause = new Bind('.pause')
// log("sumOfSongs", sumOfSongs())
// log("getMaxId", getMaxId())
// sumOfsongs() 是对 html 页面里的 歌曲总数的数字 的获取，刚开始的 html 的数字为 0
// 加载 localStorage 里面的数据的时候，每加载一条数据 html 里的歌曲总数的数字就加一
// 所以我实例化的这个类，要使用 storageMaxId() [localStorage 所有对象的长度]
var audio = new Songs(0, storageMaxId())

var deleteSong = function(id) {
    var current = audio.getCurSong().currentTime
    var duration = audio.getCurSong().duration
    var curSongId = parseInt(audio.getCurSong().id.split("-")[3])

    var songList = []
    var selector = `#id-audio-player-${id}` 
    var songId = document.querySelector(selector)
    log("songId", songId)
    songId.remove()

    var songSrc = document.querySelectorAll('.gen')
    for(var i = 0; i < songSrc.length; i++) {
        var src = songSrc[i].src
        log("src", src)
        var data = {
            src: src
        }
        songList.push(data)
    }

    // log("songList", songList)
    var selector = e('.songList')
    selector.dataset.id = "0"
    saveSongs(songList)
    insertSong(songList)
    // log("curSongId", curSongId);
    // log("id", id);
    // 2020/09/30   修复 bug 
    if(id < curSongId) {
        audio.curId -= 1
        loadingLine.setCur(current)
        loadingLine.setDur(duration)
        var t = new TimeProcess(current, duration)
        orange.Set(t.getShowLine())
        audio.getCurSong().play()
        audio.getCurSong().currentTime = current
        audio.getCurSong().play()
        timerUpdate()
    } else if(id == curSongId){
        audio.getNextSong().play()
        orange.Set(0)
        loadingLine.setCur(0) 
        timerUpdate()
    } else {
        loadingLine.setCur(current)
        loadingLine.setDur(duration)
        var t = new TimeProcess(current, duration)
        orange.Set(t.getShowLine())
        audio.getCurSong().play()
        audio.getCurSong().currentTime = current
        audio.getCurSong().play()
        timerUpdate()
    }
}

// 改变进度条
var changeProcess = function() {
    var line = e('.line')
    line.addEventListener('click', function(event) {
        if(audio.getCurSong().readyState === 4) {
            // 因为页面 body 缩放了 1.7 倍
            var duration = 140 * 1.7
            var mouseX = (event.offsetX + 1)
            var t = new TimeProcess(mouseX, duration)
            loadingLine.setCur(t.getLoadingNum())
            orange.Set(t.getShowLine())
            audio.getCurSong().currentTime = t.getLoadingNum()
            audio.getCurSong().play()
            toggleSwitch(e('.begin'), 'hide')
        }
    })
}

// 更新播放时间
var timerUpdate = function() {
    audio.getCurSong().addEventListener('timeupdate', function() {
        if(audio.getCurSong().readyState === 4) {
            var current = audio.getCurSong().currentTime
            var duration = audio.getCurSong().duration
            loadingLine.setCur(current)
            loadingLine.setDur(duration)
            var t = new TimeProcess(current, duration)
            orange.Set(t.getShowLine())
            if(audio.getCurSong().ended) {
                // toggleSwitch(targetPause, 'hide')
                // orange.Set(0)
                // loadingLine.setCur(0)
                audio.stop()
                audio.getNextSong().play()
                audio.setNextId()
                orange.Set(0)
                loadingLine.setCur(0) 
                timerUpdate()
            }
        }
    })
}

// 点击 next 后, 当前的音乐停止播放, 计算出下一次播放的 id 然后 播放 
// 进度条清 0, cur 时间清 0, dur 时间 改变，当前 curTime 设置为 0
var bindClickSwtich = function() {
    var nextSong = e('.next')
    nextSong.addEventListener('click', function() {
        log('next clicked')
        if(audio.getCurSong().readyState === 4) {
            audio.stop()
            audio.getNextSong().play()
            audio.setNextId()
            orange.Set(0)
            loadingLine.setCur(0) 
            timerUpdate()
            toggleSwitch(e('.begin'), 'hide')
        }
    })

    var preSong = e('.pre')
    preSong.addEventListener('click', function() {
        log('pre clicked')
        if(audio.getCurSong().readyState === 4) {
            audio.stop()
            audio.getPreSong().play()
            audio.setPreId()
            orange.Set(0)
            loadingLine.setCur(0) 
            timerUpdate()
            toggleSwitch(e('.begin'), 'hide')
        }
    })
}

var bindClickPlay = function() {
    begin.bindCli(function() {
        audio.getCurSong().play()
    })
    pause.bindCli(function() {
        audio.getCurSong().pause()
    })
}

var bindButton = function() {
    bindClickPlay()
    bindClickSwtich()
}

var main = function() {
    showSongs()
    bindButton()
    timerUpdate()
    changeProcess()
}

main()


// 后记：
// 0，这个项目过程中虽然遇到问题，但是正如萧大说的那样首先 不要慌 切割问题 一个个解决
// 1，通过修改 a.src 的地址可以实现 输入一个音乐的地址 然后实现播放（有时间再写吧）
// 2，这个程序后续可以增加 localStorage，以及访 ?music&1 来定位某个音乐
//      2020/09/25 20:50 完成 localStorage 以及 添加歌曲函数 功能
// 3，无论如何，这个程序优化的空间，我不是为了尽善尽美，所以这个程序就到这了
// 4，加油