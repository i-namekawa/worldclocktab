var nIntervId, tz;

// 2 functions borrowed from https://www.w3schools.com/js/js_cookies.asp
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
// borrowed till here


function applyCookie() {
    var decodedCookie = decodeURIComponent(document.cookie);
    var td = getCookie("td");
    if (td.length>0) {
        $('[name=offset]').val(td);
    }
    var t12h = getCookie("t12h");
    if (t12h == "true") {
        $('[name=t12h]')[0].checked = true;
    } else if (t12h =! "") {
        $('[name=t12h]')[0].checked = false;
    }
    var bigicon = getCookie("bigicon");
    if (bigicon == "true") {
        $('[name=bigicon]')[0].checked = true;
    } else if (bigicon =! "") {
        $('[name=bigicon]')[0].checked = false;
    }
    var analog = getCookie("analog");
    if (analog == "true") {
        $('[name=analog]')[0].checked = true;
    } else if (bigicon =! "") {
        $('[name=analog]')[0].checked = false;
    }
    var collapsed = getCookie("collapsestate_geo");
    if (collapsed == "show") {
        $("#pickgeo").collapse('show');
    } else if (collapsed =! "") {
        $("#pickgeo").collapse('hide');
    }
    var collapsed = getCookie("collapsestate_about");
    if (collapsed == "show") {
        $("#About").collapse('show');
    } else if (collapsed =! "") {
        $("#About").collapse('hide');
    }

}

// https://gist.github.com/mathiasbynens/428626
function changeFavicon(src) {
    var link = document.createElement('link'),
        oldLink = document.getElementById('dynamic-favicon');
    link.id = 'dynamic-favicon';
    link.rel = 'icon';
    link.href = src;
    if (oldLink) {
        document.head.removeChild(oldLink);
    }
    document.head.appendChild(link);
} // gist

function drawArm(ctx, r, theta, size){
    var x =  r * Math.sin(theta) + size/2,
        y = -r * Math.cos(theta) + size/2;
    ctx.beginPath();
    ctx.moveTo(size/2, size/2);
    ctx.lineTo(x, y);
    ctx.stroke();
}

function drawClock() {
    var c = $("#myCanvas")[0],
        ctx = c.getContext("2d"),
        td = $('[name=offset]').val(),
        t12h = $('[name=t12h]')[0].checked,
        analog = $('[name=analog]')[0].checked,
        bigicon = $('[name=bigicon]')[0].checked,
        photoCredit = $('#photoCredit'),
        tc = $("#textclock");
        
    // add the UTC offset to UTC time in ms
    var d = new Date(new Date().getTime() + (parseFloat(td) * 60 * 60 * 1000)),
        h = d.getUTCHours(),
        m = d.getUTCMinutes();

    // modify icon bg according to the time of day
    // Create gradient
    var size = 64;
    ctx.clearRect(0,0,size,size);
    
    var grd = ctx.createLinearGradient(0,size,0,0),
        body = $('body')[0],
        sr = $('#Sunrise').text().split(':'),
        ss = $('#Sunset').text().split(':');

    mins = h*60 + m;
    minsrise = sr[0]*60 + parseInt(sr[1]);
    minsset = ss[0]*60 + parseInt(ss[1]);

    // dawn, approximated to be 60 min before sunset
    if (minsrise-60 <= mins && mins < minsrise) {
        grd.addColorStop(0,"orange");
        grd.addColorStop(1,"#990033");
        ctx.globalAlpha=0.3;
        body.style.backgroundImage = "url('img/9eaa2333-cab0-42b0-8982-c7de58764440.jpg')";
        photoCredit.html('Photo by <a href="https://www.reshot.com/photos/i-wanna-wake-up-to-this-view-everyday_rs_Al0nk0">Nevi Egwandini</a> on <a href="https://www.reshot.com">Reshot</a>')
    // day
    } else if (minsrise <= mins && mins < minsset-60) {    
        grd.addColorStop(0,"#eeeeee");
        grd.addColorStop(1,"lightblue");
        ctx.globalAlpha=0.3;
        body.style.backgroundImage = "url('img/333d6298-02c8-4b2c-af9f-c6d8317f409e.jpg')";
        photoCredit.html('Photo by <a href="https://www.reshot.com/photos/rowboat_rs_3ayJjy">Tom Beckermann</a> on <a href="https://www.reshot.com">Reshot</a>')
    // dusk, approximated to be 60 min before sunset
    } else if (minsset-60 <= mins && mins < minsset) {
        grd.addColorStop(0,"orange");
        grd.addColorStop(1,"lightblue");
        ctx.globalAlpha=0.2;
        body.style.backgroundImage = "url('img/2810e69e-c8ae-43e2-895b-835622a1460e.jpg')";
        photoCredit.html('Photo by <a href="https://www.reshot.com/photos/corsica_rs_29zLR0">Suzana ☀️🍀💋🐠🌴🎏🌸</a> on <a href="https://www.reshot.com">Reshot</a>')
    // night
    } else {
        grd.addColorStop(0,"#545457");
        grd.addColorStop(1,"#000000");
        ctx.globalAlpha=0.7;
        body.style.backgroundImage = "url('img/c2f2f633-d86e-4cd1-917e-56332d3bcab0.jpg')";
        photoCredit.html('Photo by <a href="https://www.reshot.com/photos/nature-beauty-in-nature-night-landscape-dark-night-sky-trees-natural-light-astrophotography_rs_Qa3yKk">Duane</a> on <a href="https://www.reshot.com">Reshot</a>')
    }
    // Fill with gradient
    ctx.fillStyle = grd;
    ctx.fillRect(0,0,size,size);
    
    // init the text for digital favicon & text clock
    hourtext = h;
    mintext = m;
    // apply 12-hour if checked
    var ampm = '';
    if (t12h && h >= 12) {
        hourtext = h - 12;
        ampm = ' PM';
    } else if (t12h) {
        ampm = ' AM';
    }

    if (hourtext < 10) {hourtext = '0' + hourtext};
    hourtext = hourtext + ":";
    if (m < 10) {mintext = '0' + mintext};
    
    // digital clock
    if (analog == false) {
        ctx.globalAlpha = 1;
        ctx.font = 9.8 * size / 16 + 'px Verdana';
        if (20<=h | (0<h & h<6)) {
            ctx.fillStyle='#FFFFFF';
        } else {
            ctx.fillStyle='#000000';
        }
        ctx.fillText(hourtext, 0, size/2);
        ctx.fillText(mintext, size/8, size);
    } else {
        // analog clock
        if (20<=h | (0<h & h<6)) {  // night
            strokeStyleH='#FFFFFF';
            strokeStyleM='#99ff99';
        } else {                    // day
            strokeStyleH='#000000';
            strokeStyleM='#00a2FA';
        }
        ctx.globalAlpha = 1;
        // draw circle
        var r = size/2;
        ctx.lineWidth = 2;
        ctx.strokeStyle = strokeStyleH;
        ctx.beginPath();
        ctx.arc(r,r,r-1,0,2*Math.PI);
        ctx.stroke();
        // draw hour hand
        ctx.lineWidth = 7;
        var theta = 2 * Math.PI * h / 12,
            r = size / 4;
        drawArm(ctx, r, theta, size);
        // draw minute hand
        var theta = 2 * Math.PI * m / 60,
            r = size / 2;
        ctx.strokeStyle = strokeStyleM;
        drawArm(ctx, r, theta, size);
    }
    changeFavicon(c.toDataURL('image/png'));

    // update text clock
    tc.html('{0}{1}{2}<br/>{3}'.replace('{0}', hourtext).replace('{1}', mintext
            ).replace('{2}', ampm).replace('{3}', d.toDateString().slice(0,-5)));
    
    // update title
    if (td > 0) {
        document.title = tc.text() + ' (' + tz + ' UTC +' + td + ')';
    } else {
        document.title = tc.text() + ' (' + tz + ' UTC ' + td + ')';
    }
    // show/hide favicon canvas
    if (bigicon) {
        c.style = "display:true";
    } else {
        c.style = "display:none";
    }
    
    // update cookie
    setCookie('td', td, 30);
    setCookie('t12h', t12h, 30);
    setCookie('analog', analog, 30);
    setCookie('bigicon', bigicon, 30);

};


function reschedule() {
    drawClock();
    // reschedule update, only once per min
    nIntervId = setInterval(drawClock, 60*1000);
};


// adjust the execution cycle
function adjusttiming() {
    // refresh icon
    drawClock();

    // stop existing cycle if any
    if (nIntervId>0) {
        clearInterval(nIntervId)
    };
    // schedule to 100 ms after minute change
    var d = new Date();
    var tillnextMinute = 60 - d.getSeconds() - d.getMilliseconds()/1000;
    setTimeout(reschedule, tillnextMinute*1000+100);
};


function onMapClick(e) {
    
    var T = new Date(),        
        lat = e.latlng.lat,
        lng = e.latlng.lng;
    
    if (Math.abs(lat) > 71.4) {
        alert('latitude beyond 71.4 not supported')
        return
    }

    // convert leaflet.js lng within bound
    if(lng <= -180.0) {lng += 360.0;}
    if(lng >= 180.0) {lng -= 360.0;}
    $('[name=latlnginput]').val( lat.toString().slice(0,12) + ', ' + lng.toString().slice(0,12) )

    tz = tzlookup(lat, lng)
    if (tz in data) {
        // DST offset 1. Jul 2018 or not
        if (T.getMonth() >= 6) {  // zero-indexed! 0 -11
            td = parseFloat(data[tz][1]);
        } else {
            td = parseFloat(data[tz][0]);
        }
        $('[name=offset]').val( td )
        var sunset = sun(lat,lng,T,1,td),
            sunrise = sun(lat,lng,T,-1,td);
        $('#Sunrise').text(sunrise)
        $('#Sunset').text(sunset)
        $('#timezone').text(tz)

    } else {
        alert('Time Zone {0} not found'.replace('{0}', tz))
    }

    drawClock();

}


//https://stackoverflow.com/a/1909508/566035
var delay = (function(){
    var timer = 0;
    return function(callback, ms){
      clearTimeout (timer);
      timer = setTimeout(callback, ms);
    };
  })();

$(document).ready( function() {

    var latlng = $('#pick input').val().split(',');
    var mymap = L.map('geolocs').setView(latlng, 4);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        minZoom: 1,
        maxZoom: 8,
        attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
    }).addTo(mymap);
    mymap.on('click', onMapClick);

    // emulate a click to initialize Sunrise/Sunset/Time zone
    var e = $.Event('Click');
    e.latlng = L.latLng($('[name=latlnginput]')[0].value.split(','));
    onMapClick(e);


    // set up event handlers
    $("#pickgeo").on("hide.bs.collapse", function(){
        setCookie('collapsestate_geo', 'hide', 30);
    });
    $("#pickgeo").on("show.bs.collapse", function(){
        setCookie('collapsestate_geo', 'show', 30);
    });

    $("#About").on("hide.bs.collapse", function(){
        setCookie('collapsestate_about', 'hide', 30);
    });
    $("#About").on("show.bs.collapse", function(){
        setCookie('collapsestate_about', 'show', 30);
    });
    
    $('[name=latlnginput]').keyup( function() {
        delay( function() {
            var e = $.Event('Click'),
                ll = L.latLng($('[name=latlnginput]')[0].value.split(','));
            e.latlng = ll;
            onMapClick(e);
            mymap.panTo(ll);
        }, 2000 )
    });1
    
    // based on https://stackoverflow.com/a/26630675
    if (document.cookie.indexOf("ModalShown=true")<0) {
        $("#dismiss").click( function() {
            $("#ModalConsent").modal("hide");
            setCookie('ModalShown', 'true', 30);
        });
        $("#ModalConsent").modal('show');
    }
    applyCookie();
    adjusttiming();

});
