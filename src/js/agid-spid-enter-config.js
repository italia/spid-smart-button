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

 * Indirizzi di produzione delle risorse (attualmente test), inserire indirizzi reali
 */
window.AgidSpidEnter.prototype.config = {
    assetsBaseUrl: 'https://raw.githubusercontent.com/srescio/spid-smart-button/issue-2/separate-html-js/',
    stylesheetUrl: 'https://raw.githubusercontent.com/srescio/spid-smart-button/issue-2/separate-html-js/css/agid-spid-enter.min.css',
    providersEndpoint: 'https://raw.githubusercontent.com/srescio/spid-smart-button/issue-2/separate-html-js/src/data/spidProviders.json',
    localisationEndpoint: 'https://raw.githubusercontent.com/srescio/spid-smart-button/issue-2/separate-html-js/src/data/spidI18n.json'
};

/*
 + Crea istanza del modulo
 */
window.agidSpidEnter = new window.AgidSpidEnter();
