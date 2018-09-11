## Come contribuire
Ogni contributo e' ben accetto! E' importante pero' seguire alcune linee guida per armonizzare lo sviluppo.

## Quando contribuire
- per implementare una issue
- per fixare un bug
- per portare un enhancement all'implementazione di una funzionalita' esistente

Una discussione nella sezione delle issue e' sempre preferita prima di iniziare a lavorare su una PR, in modo da evitare di lavorare su cose potenzialmente inutili.

## Istruzioni per il set up del progetto

Il progetto ha come hard-dependency **node.js**, la versione con cui è stato sviluppato è la [v8.1.3](https://nodejs.org/dist/v8.1.3/)
es. usando *homebrew* puoi installarlo da terminale con il comando:
```
brew install node@8.1.3
```
piu' informazioni sull'installazione di nodejs si rimanda al [sito](https://nodejs.org/en/) ufficiale.

Avendo ora disponibile node.js, entra da terminale nella directory del progetto ed installa le dipendenze con il comando:
```
npm install
```
terminata l'installazione è necessario eseguire gli step build/server/watch per mandare in esecuzione l'applicazione. E' sufficiente eseguire il comando:
```
npm run serve
```
Questo comando si occupera' di fare build e lanciare l'applicazione per la modalita' di sviluppo. Il file JS minificato, che si occupa di caricare il rispettivo CSS se opportuno, a seguito della **build** è disponibile sotto la cartella `dist/` con il nome di `spid-button.min.js`.

Per fare la build a run-time e vedere istantaneamente le modifiche al codice, devi runnare contestualmente a `npm run serve` anche il comando:
```
npm run build-watch
```

Infine per testare l'applicazione
```
npm test
```
ora puoi visitare la pagina http://localhost:9090/  dalla quale puoi raggiungere:

 - la demo/sviluppo: http://localhost:9090/index.html
 - gli unit test Jasmine: http://localhost:9090/_SpecRunner.html
 - la code coverage Istanbul: http://localhost:9090/reports/coverage/dev/agid-spid-enter.min.js.html

I sorgenti si trovano nelle cartelle `src/js` ed `src/scss` e i file minificati prodotti dal task di build sono presenti nelle cartelle `dev` e `dist`.
Per sviluppare ed effettuare subito la build delle modifiche bisogna eseguire il comando `npm run watch` contestualmente al comando `npm start`.

### Code Style
*Prima di ogni commit verrà eseguito un linter* che verificherà che il codice sia stilisticamente uniforme pena il fallimento del commit, in modo da incoraggiare una scrittura coerente, per JavaScript viene utilizzata la convenzione [Crockford](http://crockford.com/javascript/code.html), per i CSS la [Stylelint Standard](https://github.com/stylelint/stylelint-config-standard), inoltre per aspetti comuni quali l'indentazione e il line ending sono presenti i file [EditorConfig](http://editorconfig.org/) e [gitattributes](https://git-scm.com/docs/gitattributes),
per velocizzare e migliorare l'esperienza di sviluppo è consigliato installare i rispettivi plugin di linting nel proprio IDE.

### JavaScript
Ogni parte del codice *deve essere corredata da unit test Jasmine*, in cui viene testata deterministicamente una singola funzionalità in maniera indipendente dagli altri test, ergo i test devono funzionare anche se eseguiti in ordine randomico. Attualmente il flag `random:true` non può essere usato perchè la corrente versione di contrib-jasmine utilizza la versione 2.4.1 in cui vi è un bug che impedisce di usare la randomicità nei test in console, da inserire quando verrà aggiornato alla version 2.5.x o superiore.
**Attenzione**
Nonostante sia possible committare anche se i test non sono verdi per consentire avanzamenti incrementali, un hook impedirà di *pushare* se i test non sono verdi, questo per impedire di divulgare codice non funzionante ad eventuali collaboratori.

La code coverage Istanbul non è attualmente bloccante ne per i commit ne per i push, viene eseguita automaticamente ad ogni push, può essere eseguita manualmente lanciando il comando:
```
npm coverage
```
Il report va utilizzato come guida per capire se vi sono parti di codice non opportunamente coperte da unit test.

### Stylesheet
Evitare di utilizzare mixins per produrre set di proprietà specifici per determinati browsers, la dipendenza Autoprefixer gestirà la retrocompatibilità come definita nel file `.browserslistrc` dopo la compilazione dei CSS minifizzati, in modo da aggiornare automaticamente tali proprietà con il futuro spostamento della baseline di supporto.

### Build
Per generare i file minificati di produzione bisogna lanciare il comando
```
npm start
```
Questo comando e' inserito nella pipeline di `trevisCI`.
Il file JS minificato, che si occupa di caricare il rispettivo CSS se opportuno, a seguito della **build** è disponibile sotto la cartella `dist/` con il nome di `spid-button.min.js`.

### Continuous integration
E' predisposta una pipeline di continuous integration tramite un server `TravisCI` per eseguire dei task ogni qual volta venga effettuata una PR.
Questa pipeline prevede che vengano eseguiti gli step di `build` e `serve` al fine di eseguire i test per verificare l'integrita' dell'applicazione. Se questi step vanno a buon fine, viene effettuata la pubblicazione su cdn.
