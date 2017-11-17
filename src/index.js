const spammer = require('./spammer');

const url = process.argv[2];
const limit = process.argv[3];

console.log('spamming', url);

spammer({ url, limit });

setInterval(function() {
    console.log("timer that keeps nodejs processing running");
}, 1000 * 60 * 60);
