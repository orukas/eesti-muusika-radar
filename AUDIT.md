# Krisori muusikaradari audit

27.10.2026 · https://orukas.github.io/eesti-muusika-radar/

## Soovitatud ja rakendatud ülesehitus

1. **Kuula kohe.** Spotify „Uus Eesti muusika” ja MuusikaPlaneedi kvartalivalik on arvutis kõrvuti, telefonis üksteise all.
2. **Maailma TOP 5.** House, deep house ja hardstyle vahetuvad nuppudest. Kõik viis lugu saavad kontrollitud Spotify vaste ja lehesisese mängija. Väljalaskefilter jääb eraldi.
3. **Uudised.** Kuus viimast saadaolevat uudist, ilma peamist kuulamisvaadet üle koormamata.
4. **Edetabelite allikad.** Selged välislingid lehe lõpus.

## Auditi leiud ja parandused

| Leid | Rakendatud parandus |
| --- | --- |
| Maailma lugusid sai ainult välislehel avada | Iga loo juures 44 px kuulamisnupp ja Spotify mängija |
| MuusikaPlaneedi kuulamisvalik puudus | Kolme algallika avalikud kuulamislingid jaotatakse neljaks kvartaliks |
| MuusikaPlaneedi perioodid pole tegelikult kvartalid | Allika jaanuar–aprill, mai–august, september–detsember on säilitatud algallikalinkidena; kvartalid arvutatakse ilmumiskuupäevast |
| Pikk leht ja kolm järjestikust maailma tabelit telefonis | Üks valitud žanr korraga, kiirnavigeerimine ja kompaktsem päis |
| Väikesed tekstid ja keerukad paneelid | Suurem kontrast, loetavad pealkirjad, murduvad pikad nimed ja üheveeruline mobiilivaade |
| RSS laadimine sõltus kahest avalikust vahendajast ja võis jääda ootama | Kohalik andmeväljavõte, 15-sekundiline päringu ajalimiit, otselingiga veateated |
| RSS pealkirjad sisestati HTML-ina | Väliste tekstide kuvamine textContent kaudu |
| Mõni vana kaart lubas täpset tabelit, kuid viis üldavalehele | Kaartide nimed ja kirjeldused viidud sihtlehega kooskõlla |
| DJ tööjuhend koormas avalikku avalehte | Põhirõhk kuulamisel ja muusika avastamisel |

## Kuulamine ja andmed

- MuusikaPlaneedist leitud Spotify/YouTube lingid on viited; helifaile ei kopeerita ega majutata.
- Korraga on avatud üks meie loodud loo mängija. Uue loo avamine eemaldab eelmise mängija. Eraldiseisev ülemine Spotify esitusloend on Spotify enda juhitav.
- Spotify võib esitada ainult eelkuulamise. Spotify versioon võib erineda DJ edetabeli extended-versioonist; mängija näitab tegelikku Spotify nime.
- YouTube'i video omaniku piirangud, piirkond ja konto võivad mõjutada esitamist. Kõigi mängijate all on varuvariant algallika avamiseks.
- Tulevased väljalasked ei ilmu avaldatud lugude kvartalivalikusse.
- Nädalauuendus on olemasolevas Codexi ajastuses esmaspäeval kell 09.00. Arvuti ja Codex peavad töötama. MuusikaPlaneedi värskendusskript säilitab vana andmestiku, kui mõni perioodileht ebaõnnestub.

## Kontrolli piirid

Testitud brauseris: lehe paigutus, kvartali muutmine, nimekirja laiendamine, žanrid, kuupäevafilter, Spotify eelkuulamine ning YouTube'i mängija. Mobiilipaigutust kontrollitakse 320, 390 ja 412 px vaateakendes. Need on telefonimõõtude testid, mitte füüsilises iPhone'i Safaris või Androidi Chrome'is tehtud katsed. Riistvaralise kontrolli viimased punktid on heli jätkumine ekraaniluku järel, seadme helinupud ja kasutaja Spotify sisselogimise käitumine.

## Edasised soovitused

- Hoia kuulamine esimese tegevusena ning väldi eraldi mängija automaatset käivitamist lehe avamisel.
- Suure looarhiivi puhul on järgmine kasulik täiendus esitaja/loo nimeotsing, mitte rohkem avalehe kaarte.
- Kui nädalauuendus peab toimima ka väljalülitatud arvutiga, vii andmevärskendus eraldi serveriajastusse.
