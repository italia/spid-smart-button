/*
NOTHING TO TOUCH HERE!!!!
    ▄▄▄▄▀▀▀▀▀▀▀▀▄▄▄▄▄▄
    █░░░░▒▒▒▒▒▒▒▒▒▒▒▒░░▀▀▄
   █░░░▒▒▒▒▒▒░░░░░░░░▒▒▒░░█
  █░░░░░░▄██▀▄▄░░░░░▄▄▄░░░█
░▀▒▄▄▄▒░█▀▀▀▀▄▄█░░░██▄▄█░░░█
█▒█▒▄░▀▄▄▄▀░░░░░░░░█░░░▒▒▒▒▒█
█▒█░█▀▄▄░░░░░█▀░░░░▀▄░░▄▀▀▀▄▒█
 █▀▄░█▄░█▀▄▄░▀░▀▀░▄▄▀░░░░█░░█
  █░░▀▄▀█▄▄░█▀▀▀▄▄▄▄▀▀█▀██░█
   █░░██░░▀█▄▄▄█▄▄█▄████░█
    █░░░▀▀▄░█░░░█░███████░█
     ▀▄░░░▀▀▄▄▄█▄█▄█▄█▄▀░░█
       ▀▄▄░▒▒▒▒░░░░░░░░░░█
          ▀▀▄▄░▒▒▒▒▒▒▒▒▒▒░█
              ▀▄▄▄▄▄░░░░░█
unless you know what you're doing... :)

 * Indirizzi di produzione delle risorse (attualmente test), inserire indirizzi reali di CDN
 * il placeholder '{{ VERSION }}' viene sostituito con la version del package dal task string-replace, non modificare!
 */
window.AgidSpidEnter.prototype.config = {
    version: '{{ VERSION }}',
    assetsBaseUrl: 'https://rawgit.com/srescio/spid-smart-button/issue-2/separate-html-js/',
    stylesheetUrl: 'https://rawgit.com/srescio/spid-smart-button/issue-2/separate-html-js/prod/agid-spid-enter.min.{{ VERSION }}.css',
    providersEndpoint: 'https://rawgit.com/srescio/spid-smart-button/issue-2/separate-html-js/src/data/spidProviders.json',
    localisationEndpoint: 'https://rawgit.com/srescio/spid-smart-button/issue-2/separate-html-js/src/data/spidI18n.json'
};

/*
 + Crea istanza del modulo
 */
window.agidSpidEnter = new window.AgidSpidEnter();
