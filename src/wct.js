var nIntervId, tz;   // clock update cycle flag, timezone
var sr, ss, dw, dk;  // Arrays for sunrise, sunset, dawn, dusk in 24 hour format

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
    var ssAPI = getCookie("ssAPI");
    if (ssAPI == "true") {
        $('[name=ssAPI]')[0].checked = true;
    } else if (ssAPI =! "") {
        $('[name=ssAPI]')[0].checked = false;
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

    // convert to min
    mins = h*60 + m;
    minrise = sr[0]*60 + parseInt(sr[1]);
    minset  = ss[0]*60 + parseInt(ss[1]);
    mindawn = dw[0]*60 + parseInt(dw[1]);
    mindusk = dk[0]*60 + parseInt(dk[1]);

    // dawn, approximated to be 60 min before sunset
    pencolor = '#000000';
    Mincolor ='#00a2FA';
    if (mindawn <= mins && mins < minrise) {
        grd.addColorStop(0,"orange");
        grd.addColorStop(1,"#990033");
        ctx.globalAlpha=0.3;
        body.style.backgroundImage = "url('img/9eaa2333-cab0-42b0-8982-c7de58764440.jpg')";
        photoCredit.html('Photo by <a href="https://www.reshot.com/photos/i-wanna-wake-up-to-this-view-everyday_rs_Al0nk0">Nevi Egwandini</a> on <a href="https://www.reshot.com">Reshot</a>')
    // day
    } else if (minrise <= mins && mins < minset) {    
        grd.addColorStop(0,"#eeeeee");
        grd.addColorStop(1,"lightblue");
        ctx.globalAlpha=0.3;
        body.style.backgroundImage = "url('img/333d6298-02c8-4b2c-af9f-c6d8317f409e.jpg')";
        photoCredit.html('Photo by <a href="https://www.reshot.com/photos/rowboat_rs_3ayJjy">Tom Beckermann</a> on <a href="https://www.reshot.com">Reshot</a>')
    // dusk 
    } else if (minset <= mins && mins < mindusk || dw == 'white nights') {
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
        pencolor = '#FFFFFF';
        Mincolor ='#99ff99';
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
        ctx.fillStyle=pencolor;
        ctx.fillText(hourtext, 0, size/2);
        ctx.fillText(mintext, size/8, size);
    } else {
        // analog clock
        ctx.globalAlpha = 1;
        // draw circle
        var r = size/2;
        ctx.lineWidth = 2;
        ctx.strokeStyle = pencolor;
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
        ctx.strokeStyle = Mincolor;
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
    setCookie('ssAPI', $('[name=ssAPI]')[0].checked, 30);

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
    // schedule to 100 ms after next minute
    var d = new Date();
    var tillnextMinute = 60 - d.getSeconds() - d.getMilliseconds()/1000;
    setTimeout(reschedule, tillnextMinute*1000+100);
};


function addampm(h,m){
    h = h % 24;
    if (h>=12) {
        // h = h - 12;
        return Math.floor(h-12) + ':' + m + ' PM'
    } else {
        return Math.floor(h) + ':' + m + ' AM'
    }
}

// lat 35 lng 139 
// {"results":{"sunrise":"2018-08-02T19:51:32+00:00","sunset":"2018-08-03T09:48:50+00:00","solar_noon":"2018-08-03T02:50:11+00:00",
// "day_length":50238,"civil_twilight_begin":"2018-08-02T19:23:12+00:00","civil_twilight_end":"2018-08-03T10:17:10+00:00",
// "nautical_twilight_begin":"2018-08-02T18:48:41+00:00","nautical_twilight_end":"2018-08-03T10:51:41+00:00",
// "astronomical_twilight_begin":"2018-08-02T18:11:40+00:00","astronomical_twilight_end":"2018-08-03T11:28:43+00:00"},"status":"OK"}
function addtd(timetext, td) {
    h = parseFloat(timetext.split(':')[0].slice(-2));
    m = parseFloat(timetext.split(':')[1]) / 60.0;
    inhours = h + m + td;
    if (inhours<0) inhours += 24;
    mm = ("0" + Math.round(inhours % 1 * 60)).slice(-2)
    return Math.floor(inhours) % 24 + ':' + mm;
}


function onMapClick(e) {
    
    var T = new Date(),        
        lat = e.latlng.lat,
        lng = e.latlng.lng,
        ssAPI = $('[name=ssAPI]')[0].checked,
        t12h = $('[name=t12h]')[0].checked;
    
    if (Math.abs(lat) > 71.4) {
        alert('latitude beyond +/-71.4 not supported')
        return
    }

    // convert leaflet.js lng within bound
    if(lng <= -180.0) {lng += 360.0;}
    if(lng >= 180.0) {lng -= 360.0;}
    $('[name=latlnginput]').val( lat.toString().slice(0,10) + ', ' + lng.toString().slice(0,10) )

    tz = tzlookup(lat, lng)
    if (tz in data) {
        // DST offset 1. Jul 2018 or not
        if (T.getMonth() >= 6) {  // zero-indexed! 0 -11
            td = parseFloat(data[tz][1]);
        } else {
            td = parseFloat(data[tz][0]);
        }
        $('[name=offset]').val(td)
        $('#timezone').text(tz)

        if (ssAPI) { // using sunrise-sunset.org API
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    res = (xhttp.responseText);
                    parsed = JSON.parse(res).results;
                    var sunrise = addtd(parsed.sunrise, td),
                        sunset  = addtd(parsed.sunset, td),
                        dawn    = addtd(parsed.nautical_twilight_begin, td),
                        dusk    = addtd(parsed.nautical_twilight_end, td);
                    // update global vars in 24 hour format
                    sr = sunrise.split(':');
                    ss = sunset.split(':');
                    dw = dawn.split(':');
                    dk = dusk.split(':');
                    
                    // ampm?
                    if (t12h) {
                        sunrise = addampm(sr[0], sr[1])
                        sunset = addampm(ss[0], ss[1])
                    }
                    
                    if (parsed.nautical_twilight_begin.slice(0,4)=='1970' && lat>60) {
                        dawn = 'white nights';
                        dusk = 'white nights';
                        dw = dawn;
                        dk = dusk;
                    } else if (t12h) {
                        dawn = addampm(dw[0], dw[1])
                        dusk = addampm(dk[0], dk[1])
                    }

                    $('#Dawn').text(dawn)
                    $('#Sunrise').text(sunrise)
                    $('#Sunset').text(sunset)
                    $('#Dusk').text(dusk)
                    adjusttiming();
                }
            };
            var url = "https://api.sunrise-sunset.org/json?lat=" + lat + "&lng=" + lng + "&formatted=0";
            xhttp.open("GET", url, true);
            xhttp.send();

        } else {  // no API call ver (e.g. offline)
            var sunset = sun(lat,lng,T,1,td), // sun return 24h format hour
                sunrise = sun(lat,lng,T,-1,td),
                h1 = parseInt(sunrise.split(':')[0]),
                m1 = sunrise.split(':')[1],
                h2 = parseInt(sunset.split(':')[0]),
                m2 = sunset.split(':')[1],
                dawn = h1-1 + ":" + m1,
                dusk = h2+1 + ":" + m2;
            
            // update global vars in 24 hour format
            sr = sunrise.split(':');
            ss = sunset.split(':');
            dw = dawn.split(':');
            dk = dusk.split(':');

            t12h = $('[name=t12h]')[0].checked
            if (t12h) {
                dawn = addampm(h1-1, m1);
                sunrise = addampm(h1, m1);
                sunset = addampm(h2,m2);
                dusk = addampm(h2+1,m2);
            }
            $('#Dawn').text(dawn)
            $('#Sunrise').text(sunrise)
            $('#Sunset').text(sunset)
            $('#Dusk').text(dusk)
            adjusttiming();

        }

    } else {
        alert('Time Zone {0} not found'.replace('{0}', tz))
    }

}


//https://stackoverflow.com/a/1909508/566035
// a function after the user has stopped typing for a specified amount of time:
var delay = (function(){
    var timer = 0;
    return function(callback, ms){
      clearTimeout (timer);
      timer = setTimeout(callback, ms);
    };
})();

// emulate a click to initialize Sun rise-set-dawn-dusk/Time zone
function emurate_mapclick(){
    var e = $.Event('Click');
    e.latlng = L.latLng($('[name=latlnginput]')[0].value.split(','));
    onMapClick(e);
}



$(document).ready( function() {

    // based on https://stackoverflow.com/a/26630675
    if (document.cookie.indexOf("ModalShown=true")<0) {
        $("#dismiss").click( function() {
            $("#ModalConsent").modal("hide");
            setCookie('ModalShown', 'true', 30);
        });
        $("#ModalConsent").modal('show');
    }
    applyCookie();

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
    
    var latlng = $('#pick input').val().split(',');
    var mymap = L.map('geolocs').setView(latlng, 4);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        minZoom: 1,
        maxZoom: 8,
        attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
    }).addTo(mymap);
    mymap.on('click', onMapClick);
    
    // update sun set/rise/dawn/dusk by emurating a click on map
    emurate_mapclick();

});
