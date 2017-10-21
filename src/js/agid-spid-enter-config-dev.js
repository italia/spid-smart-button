/*
 * Test url locale valida quando la index è avviata con grunt-serve
 */

window.AgidSpidEnter.prototype.config = {
    assetsBaseUrl: 'https://raw.githubusercontent.com/srescio/spid-smart-button/issue-2/separate-html-js/',
    stylesheetUrl: 'css/agid-spid-enter.min.css',
    providersEndpoint: '/src/data/spidProviders.json',
    localisationEndpoint: '/src/data/spidI18n.json'
};

/*
 + Crea istanza del modulo
 */
window.agidSpidEnter = new window.AgidSpidEnter();
