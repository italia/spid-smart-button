/*
 * Test url locale valida quando la index è avviata con grunt-serve
 * sostituire con endpoint reali per produzione
 */

window.AgidSpidEnter.prototype.config = {
    providersEndpoint: '/src/data/spidProviders-success.json',
    localisationEndpoint: '/src/data/spidI18n.json'
};

/*
 + Crea istanza del modulo
 */
window.agidSpidEnter = new window.AgidSpidEnter;
