window.onload = async function() {
    console.log('LOAD');
    var pictures = localStorage.getItem('pictures');

    if (pictures) {
        pictures = JSON.parse(pictures)
    } else {
        console.log('AJAX');
        var res = await ajax(api.get_pictures, {});

        if (res.ok) {
            pictures = res.data;
            localStorage.setItem('pictures', JSON.stringify(pictures))
        }
    }

    configClosePicture();

    var ghostPicture = document.getElementById('ghost-picture');
    var realPicture = document.getElementById('picture');

    if (ghostPicture && pictures) {
        ghostPicture.src = pictures.url;
        realPicture.src = pictures.url;
        realPicture.style.opacity = '0';
        ghostPicture.onload = function(e) { loadPicture(e, pictures, true)}
    }
};


var api = {
    get_pictures: {method: "GET", uri: "https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY"}
};

var ajax = async function (api, data) {

    //return {api: api, data: data}

    return await fetch(getURL(api, data), {})
        .then(function(res){ return res.json()})
        .then( function(res){
            return {ok: !res.error && res.code !== 400, data: res.error || res.code === 400 ? undefined : res}
        })
        .catch(function(e) {
        return {ok: false, status: "unreachable"}
    });
};

var getURL = function (api, data) {
    var url = api.uri;
    for (const param in data) {
        url = url + '&' + param + '=' + data[param]
    }
    console.log(url)
    return url;
};

var loadPicture = function(pic, data, ghost) {
    var thisPicture = document.getElementById('picture');
    var {clientHeight: height, clientWidth: width} = document.getElementById('main-pic');
    var {clientHeight: picHeight, clientWidth: picWidth} = pic.target;

    console.log('LOAD-PIC', ghost, thisPicture, data)
    if (ghost) {
        if (thisPicture && data) {
            thisPicture.style.opacity = '1';
            var {width, height} = calculatePicSize(width, height, picWidth, picHeight);
            thisPicture.style.width = width;
            thisPicture.style.height = height;
        }
    } else {

    }
};

var calculatePicSize = function(w, h, W, H) {

    return {
        width: '100%',
        height: 'auto'
    }

};

var configClosePicture = function() {
    var close = document.getElementById('close-picture');

    close.onclick = function() {
        var picture = document.getElementById('chosen-picture');

        if (picture) {
            picture.style.display = 'none'
        }
    }
};

