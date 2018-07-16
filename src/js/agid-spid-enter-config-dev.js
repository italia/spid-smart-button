/*
 * Test url locale valida quando la index è avviata con grunt-serve
 */

window.SPID.prototype.initResources = function () {
    this.resources = {
        assetsBaseUrl: '',
        stylesheetUrl: 'dev/agid-spid-enter.min.css',
        providersEndpoint: '/src/data/spidProviders.json',
        localisationEndpoint: '/src/data/spidI18n.json'
    };
};
