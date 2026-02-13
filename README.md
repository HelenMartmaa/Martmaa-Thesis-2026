# Veebirakendus biomeditsiiniliste loomkatsete ja ***in vitro*** katsete planeerimiseks ja eksperimentaalsete andmete analüüsimiseks ning visualiseerimiseks

## Eesmärk

Luua veebirakendus, mis võimaldab planeerida, analüüsida ja hallata katseid katseloomadega/mikroorganismidega.

**Veebirakendus võimaldab**

- planeerida katset katseloomadega/mikroorganismidega
- sisestada katsetulemusi
- arvutada automaatselt katseandmete/tulemuste põhjal peamisi statistilisi väärtusi
- kujutada katsete tulemusi ja arvutatud statistilisi väärtuseid graafikutel
- **luua planeeritud katsetest tulemustest organiseeritud ülevaadet, katsetulemuste esmast analüüsi ning nende graafilist kujutamist**
____
### Must have

- registreerimise ja -sisselogimissüsteem
- võimalus kasutada funktsionaalsusi sisselogimiseta ehk külalisena (puudub salvestamise võimalus)
- katsete planeerimine + planeeritud katse salvestamine
- katsetulemuste sisestamine + salvestamine
- katsetulemuste põhjal automaatne peamiste statistiliste arvutuste tegemine + salvestamine
- katsetulemuste ja statistiliste arvutuste väärtuste kujutamine graafikul + graafikute salvestamine
- inglise keeles
- täidetud accessibility nõuded

### Nice to have

- keelevahetamise funktsioon + est
- katsetulemuste üleslaadimine/lugemine .csv (või .xlsx) failist
- graafikute allalaadimine ??? failina
- veebirakenduse majutus
___

### Katse planeerimine

- katsetüübi valik - mikroorganismide või katseloomadega sooritatav katse
- katselooma märkimisel valikud: wild type, KO, cKO, vabatekst
- mikroorganismi märkimisel vabatekst
- katseloomade puhul täiendavate andmete sisestamine (soovi korral) - sugu, sünniaeg, täiendavad kommentaarid
- perioodi märkimine ja ajakava koostamine (kuidas?)
- kontrollrühma ja eksperimentaalrühma märkimine
- katsega seotud isikute nimede sisestamine koos rollidega (vabatekstiväljal)
- vajalike vahendite märkimine (vabatekstiväljal)
- vajalike meetodite märkimine (vabatekstiväljal)
- ravimite jne kirjeldus ja manustamisplaan (vabatekstiväljal)
- lisakommentaarid (vabatekstiväljal)
- Võimalus märkida katse sooritatuks (staatus)

### Katsete tulemused

- katsetüübi valik - mikroorganismide või katseloomadega sooritatud katse
- numbriliste väärtuste sisestamine ja nende sidumine konkreetse katseloomaga nimetuse/id/koodi põhjal (vabatekstiväljal)
- võimaluse korral ka soo (valik), sünniaja (kindel kuupäeva valik) ja muu info sisestamine (vabatekstiväljal)
- iga katselooma kohta grupi määramine - kontrollrühm või eksperimentaalrühm
- iga katselooma soo märkimine 
- lisakommentaarid (vabatekstiväljal)
- statistiliste arvutuste tegemine erinevate valimite korral (valimeid saab ise määrata nt soo, kontrollrühma kuulumise ja teiste andmete põhjal)
- võimalus märkida eksed

__**NB! Valimite määramine ei saa täiesti vaba olla, sest muidu tekib liiga suur võimalus katsetulemuste manipuleerimiseks!**__

### Statistilised arvutused

- aritmeetiline keskmine (mean)
- mediaan (median)
- standardhälve (standard deviation)
- variatsioon (variance)
- standardviga (standard error of the mean)
- vahemik (range min - max)
- Shapiro-Wilk test OR Kolmogorov-Smirnov test normaalsuse hindamiseks
- Student's t-test (paired ja unpaired) parameetrilise analüüsi jaoks
- Mann-Whitney U test mitte-parameetrilise analüüsi jaoks
- ANOVA???
- kasvukiirus (mikroorganismidel)
- kahekordistumisaeg (mikroorganismidel)
- Kaplan-Meieri meetod/kõver (mitte-parameetriline)
- p-väärtus (statistiliselt oluliste tulemuste tuvastamiseks)
- 95% usaldusvahemik (confidence interval) parameetrilise analüüsi korral

### Graafikud

- kastdiagrammid
- tulpdiagrammid
- hajuvusdiagrammid

___

### Tehniline arhitektuur

#### Frontend

Frontendi poolt lahendatavad funktsionaalsused on UI, andmete sisestus, andmete edastus backendile, tulemuste visualiseerimine.
- Javascript
- React raamistik
- Tailwind CSS
- Chart.js/Recharts/Plotly (graafikute jaoks)
- React Table

  
#### Backend

Backendis toimub äriloogika ja statistika arvutuste funktsionaalsuste tagamine (routes + controllers + services + database layer).
- Node.js + Express? VÕI Python + FastAPI
- Teegid: simple-statistics + jStat

#### Andmebaas

:star2: SQLite
Andmebaasi struktuur: ... 

#### Turvalisus ja autentimine

- JWT token
- bcrypt paroolide hash-imiseks
___

### Edasiarendused tulevikus

- Erinevate salvestatud katsete omavaheline võrdlemine
- Rohkem statistilise analüüsi võimalusi (nt Pearsoni korrelatsioon ja Spearmani korrelatsioon, lineaarne regressioon, mitmene regressioon, mittelineaarne regressioon, log-rank test, usaldusvahemikud, efekti suurus jne)
- Loomkatsete sooritamise loa lisamine failina katse planeerimise juurde
- Loomkatsete sooritamise loa taotluse koostamise vorm, mida saab pdf-na alla laadida
- Nice to have asjad, mis jäid sooritamata
