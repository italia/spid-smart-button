<img src="https://github.com/italia/spid-graphics/blob/master/spid-logos/spid-logo-b-lb.png" alt="SPID" data-canonical-src="https://github.com/italia/spid-graphics/blob/master/spid-logos/spid-logo-b-lb.png" width="500" height="98" />

[![Join the #spid-smart-button channel](https://img.shields.io/badge/Slack%20channel-%23spid--smart--button-blue.svg?logo=slack)](https://developersitalia.slack.com/messages/C7EQLBY9H)
[![Get invited](https://slack.developers.italia.it/badge.svg)](https://slack.developers.italia.it/)
[![SPID on forum.italia.it](https://img.shields.io/badge/Forum-SPID-blue.svg)](https://forum.italia.it/c/spid)

> ⚠️ **WORK IN PROGRESS** ⚠️

Lo Smart Button è un'evoluzione del bottone "Entra con SPID" che tutti i fornitori di servizi devono incorporare nei propri siti web per consentire all'utente la scelta del proprio Identity Provider e quindi l'autenticazione.

Ad oggi, ciascun fornitore di servizi adatta al proprio sito il bottone fornito nel repository [italia/spid-sp-access-button](https://github.com/italia/spid-sp-access-button) e lo incorpora staticamente. **Essendo in corso lo sviluppo dello Smart Button, i fornitori di servizi devono ancora seguire tale modalità.**

Con lo sviluppo di un nuovo bottone si intende:

* facilitare l'integrazione del bottone "Entra con SPID" riducendo il lavoro di adattamento;
* fornire un bottone ospitato via CDN senza richiedere l'incorporazione statica dello stesso;
* semplificare le operazioni di aggiunta/rimozione/modifica degli Identity Provider senza richiedere modifiche manuali a tutti i Service Provider;
* migliorare l'esperienza utente grazie ad un'interfaccia di accesso più chiara.

## Struttura del repository

La directory _new-mockup/_ contiene un mockup con il restyling grafico come da nuove _Linee Guida UX SPID_ (non ancora entrate in vigore).

## Maintainer

Questo repository è mantenuto da AgID - Agenzia per l'Italia Digitale con l'ausilio del Team per la Trasformazione Digitale.

## Link utili

* [Sito ufficiale SPID](https://www.spid.gov.it/)
* [Sezione SPID su Developers Italia](https://developers.italia.it/it/spid/)
* [Sezione SPID su AgID](https://www.agid.gov.it/it/piattaforme/spid)

## Sviluppo del progetto e produzione degli assets

Il progetto ha come hard-dependency **node.js**, la versione con cui è stato sviluppato è la [v8.1.3](https://nodejs.org/dist/v8.1.3/)
usando *homebrew* puoi installarlo da terminale con il comando:
```
brew install node@8.1.3
```
avendo ora disponibile node.js, entra da terminale nella directory del progetto ed installa le dipendenze con il comando:
```
npm install
```
terminata l'installazione è necessario eseguire gli step build/server/watch per mandare in esecuzione l'applicazione. E' sufficiente eseguire il comando:
```
npm start
```
ora puoi visitare la pagina http://localhost:9090/  dalla quale puoi raggiungere:

 - la demo/sviluppo: http://localhost:9090/index.html
 - gli unit test Jasmine: http://localhost:9090/_SpecRunner.html
 - la code coverage Istanbul: http://localhost:9090/reports/coverage/dev/agid-spid-enter.min.js.html

 I sorgenti si trovano nelle cartelle `src/js` ed `src/scss` e ad ogni cambiamento i minifizzati verrano rigenerati dal watcher grunt nelle cartelle `dev` e `dist`

### Code Style
Prima di ogni commit verrà eseguito un linter che verificherà che il codice sia stilisticamente uniforme pena il fallimento del commit, in modo da incoraggiare una scrittura coerente, per JavaScript viene utilizzata la convenzione [Crockford](http://crockford.com/javascript/code.html), per i CSS la [Stylelint Standard](https://github.com/stylelint/stylelint-config-standard), inoltre per aspetti comuni quali l'indentazione e il line ending sono presenti i file [EditorConfig](http://editorconfig.org/) e [gitattributes](https://git-scm.com/docs/gitattributes),
per velocizzare e migliorare l'esperienza di sviluppo è consigliato installare i rispettivi plugin di linting nel proprio IDE.

### JavaScript
Ogni parte del codice *deve essere corredata da unit test Jasmine*, in cui viene testata deterministicamente una singola funzionalità in maniera indipendente dagli altri test, ergo i test devono funzionare anche se eseguiti in ordine randomico. Attualmente il flag `random:true` non può essere usato perchè la corrente versione di contrib-jasmine utilizza la versione 2.4.1 in cui vi è un bug che impedisce di usare la randomicità nei test in console, da inserire quando verrà aggiornato alla version 2.5.x o superiore.
Nonostante sia possible committare anche se i test non sono verdi per consentire avanzamenti incrementali, un hook impedirà di *pushare* se i test non sono verdi, questo per impedire di divulgare codice non funzionante ad eventuali collaboratori.

La code coverage Istanbul non è attualmente bloccante ne per i commit ne per i push, viene eseguita automaticamente ad ogni push, può essere eseguita manualmente lanciando il comando:
```
npm coverage
```
Il report va utilizzato come guida per capire se vi sono parti di codice non opportunamente coperte da unit test.

### Stylesheet
Evitare di utilizzare mixins per produrre set di proprietà specifici per determinati browsers, la dipendenza Autoprefixer gestirà la retrocompatibilità come definita nel file `.browserslistrc` dopo la compilazione dei CSS minifizzati, in modo da aggiornare automaticamente tali proprietà con il futuro spostamento della baseline di supporto.

## Utilizzo del dist

### Includere minifizzato JS
Il minifizzato JS, che si occupa di caricare il rispettivo CSS se opportuno, a seguito della **build** è disponibile sotto la cartella `dist/` sia con la semantic version scolpita nel nome ad esempio `agid-spid-enter.min.1.0.0.js`, sia senza versione affissa che riferisce sempre all'ultima rilasciata eg `agid-spid-enter.min.latest.js`, includere uno solo di questi due JS nella pagina.

### Predisporre placeholder HTML per includere lo spid-smart-button
Includere nella pagina uno o più placeholder `<div>` che abbiano i seguenti attributi:

 - classe : `agid-spid-enter-button` sarà ricercato dallo script per stampare tutti i pulsanti SPID
 - selector: attributo `id` con valore customizzabile dall'utente. Obbligatorio, come valore di default usare `spid-button`
 - accessibilità : attributo `aria-live` con valore `polite` per evitare che il rendering disturbi la navigazione
 - dimensione : attributo `data-size` con una delle quattro dimensioni supportate: **s / m / l**
 - fallback: tag `<noscript>` con messaggio localizzato all'interno del placeholder che avvisa l'utente della necessità di JavaScript abilitato per poter fruire di SPID qualora l'utente stia navigando senza JavaScript

Esempio completo

```html
    <div class="agid-spid-enter-button" id='spid-button' aria-live="polite" data-size="l">
        <noscript>
            Il login tramite SPID richiede che JavaScript sia abilitato nel browser
        </noscript>
    </div>
```

l'attributo `data-size` è case-insensitive quindi può essere sia maiuscolo che minuscolo.

### Metodi pubblici del modulo SPID
Il modulo espone 4 metodi pubblici

#### `init(config, success, error)`
In caso di successo carica i CSS, mostra gli smartbutton sulla pagina e chiama la callback `success` se esiste.
In caso di errore scrive un messaggio in console e chiama la callback `error` se esiste.

##### config
Il parametro `config` serve a configurare l'intera struttura dello smart-button. Allo scopo di rendere flessibile lo smart-button assecondando le diverse applicazioni nelle quali puo' essere inserito sono state definite le seguenti proprieta':

| Parametro  | Descrizione        | Esempio |
| ---------- | ------------------ | ------- |
| **method** | GET/POST (default: GET) | GET |
| **url** | URL da chiamare (anche relativo). Il placeholder {{idp}} sarà sostituito con l’entityID dell’IdP selezionato. Se questo parametro è assente, sarà scritto un errore in console.error() | `/spid/login/idp={{idp}}` |
| **fieldName** | Se method=POST, contiene il nome del campo hidden in cui passiamo l’IdP selezionato (default: idp) | idp |
| **extraFields** | Se method=POST, contiene eventuali valori aggiuntivi da passare in campi hidden | `{ foo: “bar” }` |
| **selector** | Selettore CSS da usare per individuare l’elemento in cui iniettare lo Smart Button (default: #spid-button) | `#spid-button` |
| **mapping** | Dizionario di mappatura tra entityID e valori custom, da usare quando un SP identifica gli IdP con chiavi diverse dall’entityID | `{ “https://www.poste.it/spid”: “poste” }` |
| **supported** | (obbligatorio) Array di entityID relativi agli IdP di cui il SP ha i metadati. Gli IdP non presenti saranno mostrati in grigio all’utente. | `[ “https://www.poste.it/spid” ]` |
| **extraProviders** | Array di oggetti contenenti le configurazioni di ulteriori Identity Provider (di test) non ufficiali che si vogliano abilitare. I provider qui elencati sono automaticamente aggiunti all’elenco supported sopra descritto | ```[ {
   “entityID”: “https://testidp.mycorp.com/”,
   “entityName”: “Test IdP”
} ]``` |

ad esempio:

```javascript
var spid = new window.SPID();
spid.init({
    lang: 'en',                   // opzionale
    selector: '#my-spid-button',  // opzionale
    method: 'POST',               // opzionale
    url: '/Login',                // obbligatorio
    fieldName: 'idp',             // opzionale
    extraFields: {                // opzionale
        foo: 'bar',
        baz: 'baz'
    },
    mapping: {                    // opzionale
        'https://loginspid.aruba.it': 4,
        'https://posteid.poste.it': 5,
        'https://idp.namirialtsp.com/idp': 7,
    },
    supported: [                  // obbligatorio
            'sielte.it'
    ],
    extraProviders: [            // opzionale
        {
            "protocols": ["SAML"],
            "entityName": "Ciccio ID",
            "logo": "spid-idp-aruba.svg",
            "entityID": "https://loginciccio.it",
            "active": true
        },
        {
            "protocols": ["SAML"],
            "entityName": "Pippocert ",
            "logo": "spid-idp-infocertid.svg",
            "entityID": "https://identity.pippocert.it",
            "active": true
        }
    ],
});
```

##### success e error
Sono due callback opzionali da fornire in caso sia necessario gestire il caso di successo o di errore.

#### `changelang(lang, success, error)`
In caso di successo aggiorna i pulsanti e l'interfaccia del modale con la lingua selezionata.
La stringa `lang` deve essere costituita da due caratteri eg `it`.
Le lingue supportate sono italiano `it`, inglese `en` e tedesco `de`
```javascript
spid.changeLanguage('en');
```

##### success e error
Sono due callback opzionali da fornire in caso sia necessario gestire il caso di successo o di errore.

#### `updateSpidButtons()`
Ricerca i placeholders per ripristinare i pulsanti, utilizzabile in caso di aggiornamento dinamico della UI causante la cancellazione dei pulsanti renderizzati in fase di inizializzazione
```javascript
spid.updateSpidButtons();
```

#### `version()`
Ritorna la semantic version del modulo in uso, utile caricando il minifizzato *latest*
```javascript
spid.version();
```
