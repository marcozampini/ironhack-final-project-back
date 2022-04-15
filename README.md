# ironhack-final-project-back

Back end for Ironhack final project

## Setup

### Initial configuration

- Clone this repository

```shell
cd ironhack-final-project-back
npm install
```

### Seed the database

- Create fake users:

```shell
node db/seeds/users.seed.js
```

- Add the countries:

```shell
node db/seeds/countries.seed.js
```

- Add the names:

```shell
node db/seeds/names.seed.js
```

- Create fake boards:

```shell
node db/seeds/boards.seed.js
```

- Create fake lists:

```shell
node db/seeds/lists.seed.js
```

- Create links between names and lists:

```shell
node db/seeds/links.seed.js
```

### Start the API

```shell
npm start
```

## About the sources of the names

- 🇮🇹 Italy: Istituto Nazionale di Statistica (ISTAT), [https://www.istat.it/it/dati-analisi-e-prodotti/contenuti-interattivi/contanomi](https://www.istat.it/it/dati-analisi-e-prodotti/contenuti-interattivi/contanomi), 2020
- 🇫🇷 France: Institut national de la statistique et des études économiques (INSEE), [https://www.insee.fr](https://www.insee.fr), 2020
- 🏴󠁧󠁢󠁥󠁮󠁧󠁿 England and 🏴󠁧󠁢󠁷󠁬󠁳󠁿 Wales: Office for National Statistics, [https://www.ons.gov.uk/peoplepopulationandcommunity/birthsdeathsandmarriages/livebirths/bulletins/babynamesenglandandwales/2020](https://www.ons.gov.uk/peoplepopulationandcommunity/birthsdeathsandmarriages/livebirths/bulletins/babynamesenglandandwales/2020)
- 🏴󠁧󠁢󠁳󠁣󠁴󠁿 Scotland: National Records of Scotland, [https://www.nrscotland.gov.uk/statistics-and-data/statistics/statistics-by-theme/vital-events/names/babies-first-names/babies-first-names-2021](https://www.nrscotland.gov.uk/statistics-and-data/statistics/statistics-by-theme/vital-events/names/babies-first-names/babies-first-names-2021)
- 🇯🇪 Northern Ireland: Northern Ireland Statistics and Research Agency (NISRA), [https://www.nisra.gov.uk/publications/baby-names-2021](https://www.nisra.gov.uk/publications/baby-names-2021)
