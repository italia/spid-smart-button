# SPID - Sistema Pubblico di Identità Digitale

[![Build Status](https://travis-ci.org/italia/spid-smart-button.svg?branch=master)](https://travis-ci.org/italia/spid-smart-button) [![devDependency Status](https://david-dm.org/italia/spid-smart-button/dev-status.svg)](https://david-dm.org/italia/spid-smart-button#info=devDependencies)  [![Dependency Status](https://david-dm.org/italia/spid-smart-button.svg)](https://david-dm.org/italia/spid-smart-button)

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

### Liberaria JS
Includere la libreria minifizzata `agid-spid-enter.min.js` nella pagina, si occuperà anche del caricamento degli stili CSS necessari.

### Load time e runtime
Includendo lo script come ultimo elemento del body, i pulsanti SPID verrano mostrati al termine del caricamento delle risorse, se invece i placeholder vengono inseriti successivamente oppure i pulsanti vengono cancellati e devono essere reinseriti, dopo aver reinserito i placeholder nel DOM invoca il metodo pubblico:

    agidSpidEnter.updateSpidButtons()
