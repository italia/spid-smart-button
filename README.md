# SPID - Sistema Pubblico di Identità Digitale
## Repository componenti

Per gestire l’accesso ai servizi pubblici e privati che utilizzano il sistema SPID, si rende necessario, sia per una questione di user experience che di immagine del sistema, la standardizzazione delle interfacce, della comunicazione e dell’utilizzo del logo SPID.

## SPID BUTTON
Il bottone è presentato in 4 dimensioni (s / m / l / xl).

## Integrazione con SPID SimpleSAMLphp
Fare riferimento al repository https://github.com/italia/spid-sp-simplesamlphp per l'installazione e la configurazione di SPID SimpleSAMLphp.
Dopo aver installato e configurato SPID SimpleSAMLphp, tutte le pagine php da proteggere con autenticazione devono integrare il seguente codice di riferimento della libreria SimpleSAML:

```
require_once('../lib/_autoload.php');
$auth = new SimpleSAML_Auth_Simple($service);
$auth->requireAuth(array('saml:idp' => $idp,));
```

dove ```$service``` è il codice identificativo del servizio, come configurato nel file config/authsources.php mentre
```$idp``` è il codice identificativo dell'idp verso il quale inoltrare la richiesta di autenticazione tra gli idp configurati nel file /metadata/saml20-idp-remote.php
il parametro $idp può essere passato come parametro della richiesta GET al clic del bottone.

Per recuperare gli attributi dell'identità:

```
$attributes = $auth->getAttributes();

$name = $attributes['name'][0];
$familyName = $attributes['familyName'][0];
```
