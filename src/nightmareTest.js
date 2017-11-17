const Nightmare = require('nightmare');

const url = 'http://www.example.com';

const proxyStr = '47.88.20.189:80';

const proxyNightmare = Nightmare({
    switches: {
        'proxy-server': proxyStr
    },
    show: true
});

return proxyNightmare
    .goto(url)
    .wait('.mouthjs-playbutton')
    .click('.mouthjs-playbutton')
    .end();

setInterval(function() {
    console.log("timer that keeps nodejs processing running");
}, 1000 * 60 * 60);
