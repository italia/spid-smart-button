# SPID - Sistema Pubblico di Identità Digitale

[![devDependency Status](https://david-dm.org/srescio/spid-smart-button/dev-status.svg?branch=issue-2/separate-html-js)](https://david-dm.org/srescio/spid-smart-button?branch=issue-2/separate-html-js#info=devDependencies)

## Repository componenti

Per gestire l’accesso ai servizi pubblici e privati che utilizzano il sistema SPID, si rende necessario, sia per una questione di user experience che di immagine del sistema, la standardizzazione delle interfacce, della comunicazione e dell’utilizzo del logo SPID.

## SPID BUTTON
Il bottone è presentato in 4 dimensioni : **s / m / l / xl** .

## Utilizzo
### Requisiti HTML
Includere nella pagina uno o più placeholder <div> che abbiano i seguenti attributi:

 - classe : `agid-spid-enter-button` sarà ricercato dallo script per stampare tutti i pulsanti SPID
 - accessibilità : attributo `aria-live` con valore `polite` per evitare che il rendering disturbi la navigazione
 - dimensione : attributo `data-size` con una delle dimensioni supportate

Esempio completo

    <div class="agid-spid-enter-button" aria-live="polite" data-size="xl"></div>

l'attributo data-size viene parsato in maniera case-insensitive quindi può essere sia maiuscolo che minuscolo

### Metodi pubblici
Il modulo espone 4 metodi pubblici

#### `init(config)`
ritorna una promise che rappresenta lo stato di caricamento delle risorse necessarie, copy e providers, in caso di successo carica i CSS e mostra gli smartbutton sulla pagina

l'oggetto `config` è opzionale, se omesso le impostazioni predefinite saranno:
 - lingua italiana
 - form action URL verso la pagina in cui è caricato
 - form method GET
 - valore `name` per la sottomissione del provider ID selezionato : `provider`
un esempio in cui tutte le opzioni configurabili vengono esplicitate:

```javascript
window.agidSpidEnter.init({
    language: 'en',
    formActionUrl: 'https://hack.developers.italia.it/',
    formSubmitMethod: 'POST',
    providersPayload: {
        common: {
            providerHiddenName: 'entityId',
            atr: 1
        },
        aruba: {
            data: 'test',
            'a-nother': false
        },
        poste: {
            atr: 2
        },
        tim: {
            atr: 3,
            flag: true
        }
    }
});
```

è possibile specificare dati da includere nella submit come `<input type=hidden name value>` per tutti i providers nell'oggetto `common` o per ciascun provider, facendo riferimento alla **mappa ufficiale** degli ID dei providers (TBD).

Il parametro `providerHiddenName` modifica il valore dell'attributo `name` con cui viene veicolato l'ID del provider, il default è `provider`.

Se uno stesso dato è presente sia in `common` che nella configurazione specifica di un provider, quello specificato nel provider avrà la precedenza.

#### `changeLanguage(locale)`
ritorna una promise che rappresenta lo stato di caricamento delle copy, al termine aggiorna i pulsanti e l'interfaccia del modale con la lingua selezionata, la stringa `locale` deve essere costituita da due caratteri eg `it`

#### `updateSpidButtons()`
ricerca i placeholders per ripristinare i pulsanti, utilizzabile in caso di aggiornamento dinamico della UI causante la cancellazione dei pulsanti renderizzati in fase di inizializzazione

#### `version()`
ritorna la semantic version del modulo in uso, utile caricando il minifizzato *latest*

### Libreria JS
Il minifizzato è disponibili sia con la semantic version scolpita nel nome ad esempio `agid-spid-enter.min.1.0.0.js`, sia senza version affissa che riferisce sempre all'ultima rilasciata eg `agid-spid-enter.min.latest.js`
