# briandaviddavidson.com

Source for my personal portfolio site, [briandaviddavidson.com](https://briandaviddavidson.com). The portfolio is a single static page: plain HTML, with styles written in Sass. A small build script also pulls in my other projects so everything is served from one domain.

## Layout

| Path | What it is |
|---|---|
| `index.html` | The site |
| `sass/portfolio.scss` | Styles (source) |
| `css/portfolio.css` | Compiled styles; commit it alongside the Sass |
| `css/font-awesome.min.css`, `fonts/` | Font Awesome 4 icons |
| `images/` | Web-sized headshot and project screenshots |
| `bdd-headshot.jpeg` | Full-resolution headshot (not deployed) |
| `Davidson_Thesis.pdf` | M.S. thesis, linked from the Education section |
| `_index-original.html` | Reference copy of the 2022 resume page with the original job-description bullets (not deployed) |
| `scripts/build.sh` | Assembles the deployable site in `dist/` (gitignored) |
| `firebase.json`, `.firebaserc` | Firebase Hosting config; serves `dist/` |

## Local development

Serve the folder and open http://localhost:8000:

```sh
python3 -m http.server
```

After editing `sass/portfolio.scss`, recompile the CSS:

```sh
npx sass --no-source-map sass/portfolio.scss css/portfolio.css
```

## Site paths

| Path | Source |
|---|---|
| `/` | This repo |
| `/time-person-of-the-year/` | [time-person-of-the-year](https://github.com/briandaviddavidson/time-person-of-the-year), built with `yarn build` |
| `/projections/` | [projections](https://github.com/briandaviddavidson/projections) (`gh-pages` branch), Maptime talk |
| `/git-and-github/` | [git-and-github](https://github.com/briandaviddavidson/git-and-github) (`gh-pages` branch), Maptime talk |
| `/d3-maptime/` | [d3-maptime](https://github.com/briandaviddavidson/d3-maptime) (`gh-pages` branch), Maptime talk |

## Deploying

The site is hosted on Firebase Hosting in the `briandaviddavidson-site` Google Cloud project. Build, then deploy, from the repo root:

```sh
./scripts/build.sh
npx firebase-tools deploy --only hosting
```

`build.sh` copies an explicit list of portfolio files into `dist/`, so nothing else in this repo is published. It then clones the project repos above and adds them under their paths, building the TIME app with Yarn. Rerun it whenever any of those repos change. Before a risky change, deploy to a temporary preview URL first:

```sh
npx firebase-tools hosting:channel:deploy preview --expires 1h
```

## Domains

DNS is managed at Squarespace Domains.

| Domain | Serves |
|---|---|
| `briandaviddavidson.com` | This site (Firebase project `briandaviddavidson-site`) |
| `www.briandaviddavidson.com` | Redirects to `briandaviddavidson.com` |
| `time.briandaviddavidson.com` | Redirects to `/time-person-of-the-year/` (Firebase project `time-person-of-the-year`) |

GitHub Pages is turned off for this repo and the project repos; everything is served from `briandaviddavidson.com`.
