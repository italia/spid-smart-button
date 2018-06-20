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
 - accessibilità : attributo `aria-live` con valore `polite` per evitare che il rendering disturbi la navigazione
 - dimensione : attributo `data-size` con una delle quattro dimensioni supportate: **s / m / l / xl**
 - fallback: tag `<noscript>` con messaggio localizzato all'interno del placeholder che avvisa l'utente della necessità di JavaScript abilitato per poter fruire di SPID qualora l'utente stia navigando senza JavaScript

Esempio completo

```html
    <div class="agid-spid-enter-button" aria-live="polite" data-size="xl">
        <noscript>
            Il login tramite SPID richiede che JavaScript sia abilitato nel browser
        </noscript>
    </div>
```

l'attributo `data-size` è case-insensitive quindi può essere sia maiuscolo che minuscolo.

### Metodi pubblici del modulo SPID
Il modulo espone 4 metodi pubblici

#### `init(config)`
Ritorna una promise che rappresenta lo stato di caricamento delle risorse necessarie, copy e providers, in caso di successo carica i CSS e mostra gli smartbutton sulla pagina

l'oggetto `config` è opzionale, se omesso le impostazioni predefinite saranno:
 - lingua italiana
 - un url di default `/login?entityId={{entityID}}`, dove il valore del parametro tra parentesi graffe verrà sostituito dalla libreria con il valore dell'entityID del provider corrente
 - form method GET

ovvero:
```javascript
var spid = new window.SPID();
    spid.init({
        lang: 'en',
        providers: {
            get: '/login?entityId={{entityID}}'
        }
    });
```

E' possibile specificare un altro url per una chiamata GET a condizione che contenga al suo interno il tag `{{entityID}}`, che è obbligatorio.

In alternativa al metodo GET possiamo configurare una chiamata POST, fornendo:
- un url per la form action
- un valore `fieldName` che rappresenta il nome della input nascosta che conterrà l'id del provider

ad esempio:

```javascript
var spid = new window.SPID();
    spid.init({
        lang: 'en',
        providers: {
            post: {
                action: '/login',
                fieldName: 'entityID'
            }
        }
    });
```

Infine è possibile fornire una customizzazione per singolo provider, come ad esempio un url diverso o una configurazione per una chiamata POST, esplicitando un oggetto che abbia come nome il valore del campo provider all'interno del file `spidProviders.json` (es. 'poste' per Poste, 'spid' per SpidItalia etc..)

Un esempio in cui tutte le opzioni configurabili vengono esplicitate:

```javascript
var spid = new window.SPID();
    spid.init({
        lang: 'en',
        providers: {
            get: '/login?entityId={{entityID}}',
            poste: {
                post: {
                    action: '/login',
                    fieldName: 'entityID'
                }
            }
        }
    });
```
Dove è stata fornita ad esempio una configurazione custom per il provider delle Poste.

#### `changelang(lang)`
Ritorna una promise che rappresenta lo stato di caricamento delle copy, al termine aggiorna i pulsanti e l'interfaccia del modale con la lingua selezionata, la stringa `lang` deve essere costituita da due caratteri eg `it`.
Le lingue supportate sono italiano `it`, inglese `en` e tedesco `de`
```javascript
spid.changeLanguage('en');
```

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
