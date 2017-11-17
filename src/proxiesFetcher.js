var ProxyLists = require('proxy-lists');

module.exports = function fetchProxies() {
    return new Promise(function(resolve) {
        // `gettingProxies` is an event emitter object. 
        var gettingProxies = ProxyLists.getProxies();
        var proxies = [];

        gettingProxies.on('data', function(p) {
            proxies = proxies.concat(p);
        });

        gettingProxies.on('error', function(error) {
            console.error('proxiesFetcher error:', error);
        });

        gettingProxies.once('end', function() {
            console.log('fetched', proxies.length, 'proxies');
            resolve(proxies);
        });
    });
}
