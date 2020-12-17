var packageJson          = require('../package.json'),
    supportedNodeVersion = packageJson.engines.node,
    currentNodeVersion   = process.version;

function stripNonDigits(string) {
    return parseInt(string.replace(/\D/g, ''), 10);
}

if (stripNonDigits(supportedNodeVersion) !== stripNonDigits(currentNodeVersion)) {
    console.log('Questo progetto è stato sviluppato con la versione di node.js', supportedNodeVersion);
}

if (stripNonDigits(supportedNodeVersion) > stripNonDigits(currentNodeVersion)) {
    console.log('la versione rilevata è inferiore:', currentNodeVersion);
    console.log('Se ci sono problemi con l\'installazione delle dipendenze prova a fare un upgrade della tua versione di node.js\n\n');
}
