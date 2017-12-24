/*
 * Test url locale valida quando la index è avviata con grunt-serve
 */

window.AgidSpidEnter.prototype.config = {
    version: '{{ VERSION }}',
    assetsBaseUrl: '',
    stylesheetUrl: 'dev/agid-spid-enter.min.css',
    providersEndpoint: '/src/data/spidProviders.json',
    localisationEndpoint: '/src/data/spidI18n.json'
};

/*
 * Crea istanza del modulo
 */
window.agidSpidEnter = new window.AgidSpidEnter();
