EST
# 🧬 Biomeditsiiniliste *in vivo* ja *in vitro* katsete planeerimise ja analüüsimise veebirakendus

Täisfunktsionaalne *full-stack* veebirakendus, mis võimaldab biomeditsiiniliste katsete planeerimist, andmete sisestamist ning statistilist analüüsi ja visualiseerimist ühes keskkonnas.

## Projekti ülevaade

Praktikas kasutatakse biomeditsiinilistes uuringutes sageli mitut eraldiseisvat tööriista (nt Excel + statistikatarkvara), mis muudab töövoo killustatuks.

**Käesolev rakendus lahendab selle probleemi, pakkudes ühte integreeritud veebikeskkonda, mis:**
- vähendab tööprotsessi killustatust;
- parandab andmete korrektsust;
- toetab tulemuste reprodutseeritavust;
- lihtsustab statistiliste analüüside teostamist.

**Projekti eesmärk on pakkuda killustatud töövoo asemele lahendus, kus töövoog on koondatud ühte kasutajasõbralikku veebirakendusse.**
___
## Peamised funktsionaalsused

**🧪 Katse planeerimine**
- katsete loomine ja haldamine (*in vivo* ja *in vitro*);
- gruppide defineerimine (kontrollgrupp, eksperimentaalgrupp jne);
- katsesubjektide defineerimine (kood/nimetus, sugu, grupp).

**📊 Andmete sisestamine**
- arvulised andmestikud;
- ajast sõltuvad (time-course) andmed;
- elulemus/sündmus (survival/event) andmed;
- tabelipõhine andmesisestus.

**📈 Statistiline analüüs**
- Kirjeldav statistika:
  - aritmeetiline keskmine;
  - mediaan;
  - standardhälve;
  - variatsioon;
  - standardviga (SEM);
  - vahemik;
  - 95% usaldusvahemik.
- Statistilised testid:
  - Shapiro–Wilk test;
  - Studenti t-test;
  - Mann–Whitney U test.
- Täiendavad analüüsid:
  - kasvukiirus;
  - kahekordistumisaeg;
  - Kaplan–Meieri elulemusanalüüs.

**📉 Visualiseerimine**
- tulpdiagrammid;
- hajuvusdiagrammid;
- kasvukõverad;
- Kaplan–Meier elulemusgraafik.

**👤 Külaliskasutajarežiim**
- ei vaja sisse logimist;
- kohene andmete analüüsimine.
___
## Arhitektuur
Rakendus kasutab mikroteenustel põhinevat arhitektuuri:
- Frontend (React);
- Backend (Node.js / Express);
- PostgreSQL (Prisma ORM);
- Python mikroteenus (FastAPI).

Peamised valiku põhjused:
- vastutusalade eraldamine (UI / äriloogika / arvutused);
- Python statistiliste arvutuste jaoks;
- mikroteenuse kasutamine skaleeritavuse tagamiseks.
___
## Tehnoloogiad

**Frontend:**
- React, Vite
- Tailwind CSS
- shadcn/ui
- Recharts

**Backend:**
- Node.js
- Express

**Andmebaas:**
- PostgreSQL
- Prisma ORM

**Statistika mikroteenus:**
- Python
- FastAPI
- NumPy, SciPy
- math, statistics
___
## Kasutaja töövoog
**Registreeritud kasutaja**
1. Registreerumine / sisselogimine
2. Katse loomine
3. Gruppide ja katsesubjektide defineerimine salvestatud katses
4. Andmestiku loomine soovitud andmestiku tüübi vormingus (salvestatud katsega seotud või eraldiseisev)
5. Tulemuste sisestamine
6. Statistilise analüüsi läbiviimine
7. Tulemuste ja graafikute vaatamine

**Külaliskasutaja**
1. Külastajarežiimis külalise analüüsilehele suunamine
2. Valib andmestiku tüübi
3. Adnmete sisestamine
4. Analüüsi käivitamine
5. Tulemuste ja graafikute vaatamine

### Väljundid
- kirjeldava statistika tabelid;
- statistiliste testide tulemused (p-väärtused);
- kasvukõverad;
- Kaplan–Meieri graafikud;
- hajuvusdiagramm kogu valimi kohta;
- tulpdiagramm keskmise, kesmine + standardhälve, keskmine + standardviga visualiseerimiseks.
___
## Projekti struktuur
Ülevaade projekti põhilistest komponentidest:
```text
Martmaa-Thesis-2026/
├── backend-node/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   └── app.js
│   ├── package.json
│   └── .env
│
├── docs/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   │   ├── analysis/
│   │   │   ├── auth/
│   │   │   ├── common/
│   │   │   ├── dashboard/
│   │   │   ├── guest/
│   │   │   ├── planning/
│   │   │   └── ui/
│   │   ├── context/
│   │   ├── features/
│   │   │   ├── analysis/
│   │   │   ├── auth/
│   │   │   └── planning/
│   │   ├── layouts/
│   │   ├── pages/
│   │   │   ├── private/
│   │   │   |   ├── analysis/
│   │   │   |   └── planning/
│   │   │   └── public/
│   │   ├── services/
│   │   └── main.jsx
│   ├── vite.config.js
│   └── package.json
│
├── statistics-service/
│   ├── app/
│   │   └── main.py
│   ├── venv/
│   └── requirements.txt
│
├── .gitignore
├── package/lock.json
├── package.json
└── README.md
```
___
## ⚙️ Rakenduse käivitamine
**1. Klooni projekt**
```bash
git clone <repo-url>
```
**2. Backend**
```bash
cd backend-node
npm install
npm run dev
```
**3. Frontend**
```bash
cd frontend
npm install
npm run dev
```
**4. Python statistika mikroteenus**
```bash
cd statistics-service
python -m venv venv
venv\Scripts\Activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
___
## API lõpp-punktid
**Autentimine**
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
```
**Katsed**
```
GET    /api/experiments
POST   /api/experiments
GET    /api/experiments/:id
PUT    /api/experiments/:id
DELETE /api/experiments/:id
```
**Katserühmad**
```
GET    /api/experiments/:experimentId/groups
POST   /api/experiments/:experimentId/groups
PUT    /api/experiments/:experimentId/groups/:groupId
DELETE /api/experiments/:experimentId/groups/:groupId
```
**Katsesubjektid**
```
GET    /api/experiments/:experimentId/subjects
POST   /api/experiments/:experimentId/subjects
PUT    /api/experiments/:experimentId/subjects/:subjectId
DELETE /api/experiments/:experimentId/subjects/:subjectId
```
**Tiimiliikmed**
```
GET    /api/experiments/:experimentId/team-members
POST   /api/experiments/:experimentId/team-members
PUT    /api/experiments/:experimentId/team-members/:memberId
DELETE /api/experiments/:experimentId/team-members/:memberId
```
**Tulemuste andmestikud**
```
GET    /api/result-sets
POST   /api/result-sets
GET    /api/result-sets/:id
PUT    /api/result-sets/:id
DELETE /api/result-sets/:id
```
**Tulemuste kirjed**
```
GET    /api/result-sets/:resultSetId/entries
POST   /api/result-sets/:resultSetId/entries
PUT    /api/result-sets/:resultSetId/entries/:entryId
DELETE /api/result-sets/:resultSetId/entries/:entryId
```
**Statistilised analüüsid**
```
GET    /api/statistical-analyses
POST   /api/statistical-analyses
GET    /api/statistical-analyses/:id
DELETE /api/statistical-analyses/:id
```
**Pythoni statistika mikroteenus**
```
GET    /health
POST   /analyze
```
___
## Projekti tugevused
🔗 *Full-stack* + mikroteenuste arhitektuur
🧠 Reaalsete statistiliste meetodite rakendamine
📊 Andmete visualiseerimine teaduslikus kontekstis
👤 Külaliskasutaja funktsionaalsus (parem UX)
🧪 Domeenispetsiifiline (biomeditsiin)
___
## Edasised arendussuunad
- ANOVA, regressioonanalüüs, Log-rank test elulemuse andmete jaoks;
- analüüsi tulemuste eksport (PDF, CSV);
- katseandmete import (CSV);
- mitme kasutaja koostööfunktsioonid;
- täiendavad interaktiivsed graafikud.
___
## Autor
Arendatud kutseõppe lõputöö raames (2026)
Fookus: *Full-stack* arendus ja biomeditsiiniliste andmete analüüs
## Litsents
Projekt on litsentseeritud Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0) litsentsi alusel.

Projekti võib kasutada, uurida ja edasi arendada hariduslikel ja mitteärilistel eesmärkidel tingimusel, et algsele autorile ja lõputöö projektile viidatakse korrektselt.
___
___
ENG
# 🧬 Biomedical *in vivo* and *in vitro* Experiment Planning & Analysis Web Application

A full-stack web application designed to streamline biomedical experiment workflows — from planning to statistical analysis and visualization — in a single unified environment.

## Project Overview

In real-world biomedical research, experiment planning, data collection, and statistical analysis are often handled using separate tools (e.g., spreadsheets + statistical software).

**This project solves that problem by providing an integrated, web-based platform that:**
- Reduces workflow fragmentation
- Improves data consistency
- Supports reproducibility
- Simplifies statistical analysis

**The goal of the project is to replace fragmented workflows with a unified, user-friendly web solution.**
____
## Key Features

**🧪 Experiment Planning**
- Create and manage experiments (*in vivo* and *in vitro*)
- Define groups (control, treatment, etc.)
- Manage experiment subjects (code/name, sex, group)

**📊 Data Entry**
- Numeric datasets
- Time-course data
- Survival/event data
- Batch table-based input UI

**📈 Statistical Analysis**
- Descriptive statistics:
  - Mean
  - Median
  - Standard deviation
  - Variance
  - Standard Error of the Mean (SEM)
  - Range
  - 95% confidence interval
- Statistical tests:
  - Shapiro–Wilk test
  - Student’s t-test
  - Mann–Whitney U-test
- Advanced:
  - Growth rate
  - Doubling time
  - Kaplan–Meier survival analysis

**📉 Data Visualization**
- Bar charts
- Scatter plots
- Time-course line charts
- Kaplan–Meier survival curves

**👤 Guest Mode**
- No login required
- Instant analysis
____
## Architecture
The application follows a modular microservice-based architecture:

- Frontend (React)
- Backend (Node.js / Express)
- PostgreSQL (Prisma ORM)
- Python Microservice (FastAPI)

Key Reasons of Decisions:
- Separation of concerns (UI / logic / computation)
- Python used for scientific computing
- Microservice architecture for scalability
____
## Tech Stack

**Frontend:**
- React, Vite
- Tailwind CSS
- shadcn/ui
- Recharts

**Backend:**
- Node.js
- Express

**Database:**
- PostgreSQL
- Prisma ORM

**Statistics Microservice:**
- Python
- FastAPI
- NumPy, SciPy
- math, statistics
____
## User Workflow
**Registered User**
1. Create account / log in
2. Create experiment
3. Define groups & subjects in created experiments
4. Create dataset (either linked to saved experiment or standalone)
5. Enter results to dataset
6. Run statistical analysis
7. View metrics and charts

**Guest User**
1. Open Guest Mode for Guest Analysis
2. Select dataset type
3. Enter result data
4. Run analysis
5. View metrics and charts

### Example Outputs
- Descriptive statistics tables
- Statistical test results (p-values, statistics)
- Time-course growth curves
- Kaplan-Meier survival plots
- Scatter plot for whole selected data
- Bar charts of mean, mean + standard deviation, mean + standard error of the mean
___
## Project Structure
Overview of main components:

```text
Martmaa-Thesis-2026/
├── backend-node/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   └── app.js
│   ├── package.json
│   └── .env
│
├── docs/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   │   ├── analysis/
│   │   │   ├── auth/
│   │   │   ├── common/
│   │   │   ├── dashboard/
│   │   │   ├── guest/
│   │   │   ├── planning/
│   │   │   └── ui/
│   │   ├── context/
│   │   ├── features/
│   │   │   ├── analysis/
│   │   │   ├── auth/
│   │   │   └── planning/
│   │   ├── layouts/
│   │   ├── pages/
│   │   │   ├── private/
│   │   │   |   ├── analysis/
│   │   │   |   └── planning/
│   │   │   └── public/
│   │   ├── services/
│   │   └── main.jsx
│   ├── vite.config.js
│   └── package.json
│
├── statistics-service/
│   ├── app/
│   │   └── main.py
│   ├── venv/
│   └── requirements.txt
│
├── .gitignore
├── package/lock.json
├── package.json
└── README.md
```
___
## ⚙️ Running the Project
**1. Clone the project**
```bash
git clone <repo-url>
```
**2. Backend**
```bash
cd backend-node
npm install
npm run dev
```
**3. Frontend**
```bash
cd frontend
npm install
npm run dev
```
**4. Python Statistics Microservice**
```bash
cd statistics-service
python -m venv venv
venv\Scripts\Activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
___
## API Endpoints
**Authentication**
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
```
**Experiments**
```
GET    /api/experiments
POST   /api/experiments
GET    /api/experiments/:id
PUT    /api/experiments/:id
DELETE /api/experiments/:id
```
**Experiment groups**
```
GET    /api/experiments/:experimentId/groups
POST   /api/experiments/:experimentId/groups
PUT    /api/experiments/:experimentId/groups/:groupId
DELETE /api/experiments/:experimentId/groups/:groupId
```
**Experiment subjects**
```
GET    /api/experiments/:experimentId/subjects
POST   /api/experiments/:experimentId/subjects
PUT    /api/experiments/:experimentId/subjects/:subjectId
DELETE /api/experiments/:experimentId/subjects/:subjectId
```
**Experiment team members**
```
GET    /api/experiments/:experimentId/team-members
POST   /api/experiments/:experimentId/team-members
PUT    /api/experiments/:experimentId/team-members/:memberId
DELETE /api/experiments/:experimentId/team-members/:memberId
```
**Result datasets**
```
GET    /api/result-sets
POST   /api/result-sets
GET    /api/result-sets/:id
PUT    /api/result-sets/:id
DELETE /api/result-sets/:id
```
**Result entries**
```
GET    /api/result-sets/:resultSetId/entries
POST   /api/result-sets/:resultSetId/entries
PUT    /api/result-sets/:resultSetId/entries/:entryId
DELETE /api/result-sets/:resultSetId/entries/:entryId
```
**Statistical analyses**
```
GET    /api/statistical-analyses
POST   /api/statistical-analyses
GET    /api/statistical-analyses/:id
DELETE /api/statistical-analyses/:id
```
**Python statistics service**
```
GET    /health
POST   /analyze
```
____
## What Makes This Project Strong
🔗 Full-stack + microservices architecture
🧠 Real scientific/statistical logic implemented
📊 Data visualization with real-world use cases
👤 Guest mode (UX-focused feature)
🧪 Domain-specific (biomedicine)
____
## Future Improvements
- ANOVA, regression, log-rank test
- Analysis results export (PDF / CSV)
- Data upload from file (CSV)
- Multi-user collaboration
- Advanced interactive charts
___
## Author
Developed as a vocational training thesis project (2026)
Focus: Full-stack development + biomedical data analysis
___
## License
This project is licensed under the Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0) license.

You are free to use, study, and modify this project for educational and non-commercial purposes, provided that appropriate credit is given to the original author and thesis project.