<img src="https://github.com/italia/spid-graphics/blob/master/spid-logos/spid-logo-b-lb.png" alt="SPID" data-canonical-src="https://github.com/italia/spid-graphics/blob/master/spid-logos/spid-logo-b-lb.png" width="500" height="98" />

[![Join the #spid-smart-button channel](https://img.shields.io/badge/Slack%20channel-%23spid--smart--button-blue.svg?logo=slack)](https://developersitalia.slack.com/messages/C7EQLBY9H)
[![Get invited](https://slack.developers.italia.it/badge.svg)](https://slack.developers.italia.it/)
[![SPID on forum.italia.it](https://img.shields.io/badge/Forum-SPID-blue.svg)](https://forum.italia.it/c/spid) [![CircleCI](https://circleci.com/gh/italia/spid-smart-button/tree/master.svg?style=svg)](https://circleci.com/gh/italia/spid-smart-button/tree/master)

> ⚠️ **WORK IN PROGRESS** ⚠️

Lo Smart Button è un'evoluzione del bottone "Entra con SPID" che tutti i fornitori di servizi devono incorporare nei propri siti web per consentire all'utente la scelta del proprio Identity Provider e quindi l'autenticazione.

Ad oggi, ciascun fornitore di servizi adatta al proprio sito il bottone fornito nel repository [italia/spid-sp-access-button](https://github.com/italia/spid-sp-access-button) e lo incorpora staticamente. **Essendo in corso lo sviluppo dello Smart Button, i fornitori di servizi devono ancora seguire tale modalità.**

Con l'utilizzo di spid-smart-button si intende:

* facilitare l'integrazione del bottone "Entra con SPID" riducendo il lavoro di adattamento;
* fornire un bottone ospitato via CDN senza richiedere l'incorporazione statica dello stesso;
* semplificare le operazioni di aggiunta/rimozione/modifica degli Identity Provider senza richiedere modifiche manuali a tutti i Service Provider;
* migliorare l'esperienza utente grazie ad un'interfaccia di accesso più chiara.

## Maintainer

Questo repository è mantenuto da AgID - Agenzia per l'Italia Digitale con l'ausilio del Team per la Trasformazione Digitale.

## Link utili

* [Sito ufficiale SPID](https://www.spid.gov.it/)
* [Sezione SPID su Developers Italia](https://developers.italia.it/it/spid/)
* [Sezione SPID su AgID](https://www.agid.gov.it/it/piattaforme/spid)


## Utilizzo dello smart-button
Nel momento in cui lo spid-smart-button sara' disponibile tramite cdn, sara' sufficiente importare lo script presente su CDN nell'applicazione in cui si intende utilizzarlo. Ad es.
```html
<script type="text/javascript" src="cdn/spid-button.min.js"></script>
```

### Come inserire lo spid-smart-button in una applicazione
E' sufficiente includere in un punto del codice html uno o più placeholder `<div>` che abbiano i seguenti attributi:

 - selector: attributo `id` con valore customizzabile dall'utente. Obbligatorio, come valore di default usare `spid-button`
 - accessibilità : attributo `aria-live` con valore `polite` per evitare che il rendering disturbi la navigazione
 - fallback: tag `<noscript>` con messaggio localizzato all'interno del placeholder che avvisa l'utente della necessità di JavaScript abilitato per poter fruire di SPID qualora l'utente stia navigando senza JavaScript.

Ad es.

```html
    <div id ='spid-button' aria-live="polite">
        <noscript>
            Il login tramite SPID richiede che JavaScript sia abilitato nel browser
        </noscript>
    </div>
```

### Come configurare lo spid-smart-button

#### `init(config)`
Questo metodo consente di configurare lo smart-button nel modo desiderato tramite il parametro `config`.
In caso di successo carica i CSS, mostra gli smartbutton sulla pagina,
In caso di errori o configurazioni errate, alcuni Warning o messaggi vengono visualizzati in console.

##### config
Il parametro `config` serve a configurare l'intera struttura dello smart-button. Allo scopo di rendere flessibile lo smart-button assecondando le diverse applicazioni nelle quali puo' essere inserito sono state definite le seguenti proprieta':

| Parametro  | Descrizione        | Esempio |
| ---------- | ------------------ | ------- |
| **method** | GET/POST (default: GET) | GET |
| **url** | URL da chiamare (anche relativo). Il placeholder {{idp}} sarà sostituito con l’entityID dell’IdP selezionato. Se questo parametro è assente, sarà scritto un errore in console.error() | `/spid/login/idp={{idp}}` |
| **fieldName** | Se method=POST, contiene il nome del campo hidden in cui passiamo l’IdP selezionato (default: idp) | idp |
| **extraFields** | Se method=POST, contiene eventuali valori aggiuntivi da passare in campi hidden | `{ foo: "bar" }` |
| **selector** | Selettore CSS da usare per individuare l’elemento in cui iniettare lo Smart Button (default: #spid-button) | `#spid-button` |
| **mapping** | Dizionario di mappatura tra entityID e valori custom, da usare quando un SP identifica gli IdP con chiavi diverse dall’entityID | `{ "https://www.poste.it/spid": "poste" }` |
| **supported** | (obbligatorio) Array di entityID relativi agli IdP di cui il SP ha i metadati. Gli IdP non presenti saranno mostrati in grigio all’utente. | `[ "https://www.poste.it/spid" ]` |
| **extraProviders** | Array di oggetti contenenti le configurazioni di ulteriori Identity Provider (di test) non ufficiali che si vogliano abilitare. I provider qui elencati sono automaticamente aggiunti all’elenco supported sopra descritto | `[{ "entityID": "https://testidp.mycorp.com/", "entityName": "Test IdP" }]` |
| **protocol** | SAML/OIDC. Protocollo usato dal SP per interagire con gli IdP. Dal momento che alcuni IdP potrebbero non supportare OIDC, questo parametro serve per mostrare in grigio gli IdP non supportati (default: SAML) | SAML |
| **size** | small/medium/large. Dimensione di visualizzazione (default: medium) | medium |
| **colorScheme** | positive/negative. Schema di colori da adottare in base allo sfondo (default: positive) | positive |
| **fluid** | true/false. Adatta la larghezza del bottone all’elemento che lo contiene (ma max 400px).  (default: false) | true |
| **cornerStyle** | rounded/sharp. Stile degli angoli del bottone. Se impostato a sharp, il bottone non avrà margine. (default: rounded) | rounded |

ad esempio:

```javascript
var spid = SPID.init({
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
            'https://identity.sieltecloud.it'
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
    protocol: "SAML",
    size: "small"
});
```

#### `changeLanguage(lang)`
Questo metodo consente di cambiare la lingua dello smart-button a run-time.
La stringa `lang` deve essere costituita da due caratteri eg `it`.
Le lingue supportate sono italiano `it`, inglese `en` e tedesco `de`
```javascript
spid.changeLanguage('en');
```

### Configurazione degli Identity Provider
I dati degli IdP sono riportati staticamente nel codice sorgente dello Smart-Button, che quindi non dovrà interrogare il Registro. Tali dati sono strutturati come segue:

| Parametro | Descrizione |
| --------- | ----------- |
| **entityID** | Identificativo dell’Identity Provider |
| **entityName** | Nome pubblico dell’Identity Provider da mostrare nella lista |
| **logo** | URL completo del file PNG raffigurante il logo (default: indicare una immagine generica, distribuita nella CDN, da usare come placeholder) |
| **protocols** | Array che può contenere i valori SAML e/o OIDC a seconda dei protocolli supportati dall’IdP |
| **active** | true/false, indica se l’IdP è operativo. Può essere usato per disabilitarne uno temporaneamente in tutta la federazione (default: true) |

Nel caso in cui l’utente configuri ulteriori IdP usando il parametro `extraProviders` all'interno della configurazione in fase di `SPID.init()`, dovrà fornire queste informazioni.
