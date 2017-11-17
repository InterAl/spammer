const proxiesFetcher = require('./proxiesFetcher');
const axios = require('axios');
const PromiseThrottle = require('promise-throttle');
const Nightmare = require('nightmare');

const useNightmare = false;

let executeRequest, proxySpam;

if (useNightmare) {
    executeRequest = executeRequestByNightmare;
    proxySpam = proxySpamSerial;
} else {
    executeRequest = executeRequestByAxios;
    proxySpam = proxySpamParallel;
}

function spam({ url, limit }) {
    proxiesFetcher()
        .then(proxySpam.bind(null, url, limit))
        .then(function() {
            console.log('done');
        });
}

function proxySpamSerial(url, limit, proxies) {
    function recur(idx) {
        executeRequest(url, proxies[idx])
            .then(() => {
                console.log(idx, 'done');
                recur(idx + 1);
            })
            .catch(err => {
                console.log(idx, 'failed', err);
                recur(idx + 1);
            });
    }

    recur(50);
    recur(250);
    recur(450);
    recur(650);
}

function proxySpamParallel(url, limit, proxies) {
    let successCount = 0,
        failureCount = 0;

    const promiseThrottle = new PromiseThrottle({
        requestsPerSecond: 20
    });

    return proxies.map(function (proxy, index) {
        return promiseThrottle.add(() => {
            return Promise.resolve()
                .then(() => {
                    if (successCount <= limit)
                        return executeRequest(url, proxy);
                })
                .then(() => {
                    successCount++;
                    console.log('success count:', successCount, 'limit:', limit);
                })
                .catch(() => {
                    failureCount++;
                    console.log('failure count:', failureCount, 'limit:', limit);
                });
        });
    });
}

function executeRequestByAxios(url, proxy) {
    console.log('exec via:', proxy.ipAddress);
    return axios(url, {
        proxy: {
            host: proxy.ipAddress,
            port: proxy.port
        }
    });
}

function executeRequestByNightmare(url, proxy) {
    const proxyStr = `${proxy.ipAddress}:${proxy.port}`;

    console.log('exec via:', proxyStr);

    const proxyNightmare = Nightmare({
        switches: {
            'proxy-server': proxyStr
        },
    });

    return proxyNightmare
        .goto(url)
        .wait('.mouthjs-playbutton')
        .click('.mouthjs-playbutton')
        .end();
}

module.exports = spam;
