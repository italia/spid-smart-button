const packageJson = require('../package.json');
const supportedNodeVersion = packageJson.engines.node;
const currentNodeVersion = process.version;

function stripNonDigits(string) {
    return parseInt(string.replace(/\D/g, ''), 10);
}

if (stripNonDigits(supportedNodeVersion) !== stripNonDigits(currentNodeVersion)) {
    console.log('This project was developed with node.js version', supportedNodeVersion);
}

if (stripNonDigits(supportedNodeVersion) < stripNonDigits(currentNodeVersion)) {
    console.log('current version detected is ahead:', currentNodeVersion);
    console.log('If anything is wrong with depencies install try downgranding your node.js version\n\n');
}

if (stripNonDigits(supportedNodeVersion) > stripNonDigits(currentNodeVersion)) {
    console.log('current version detected is behind:', currentNodeVersion);
    console.log('If anything is wrong with depencies install try upgrading your node.js version\n\n');
}
