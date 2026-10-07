# briandaviddavidson.com

Source for my personal portfolio site, [briandaviddavidson.com](https://briandaviddavidson.com). It's a single static page: plain HTML, with styles written in Sass. There's no framework and no build step beyond compiling the CSS.

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
| `firebase.json`, `.firebaserc` | Firebase Hosting config |

## Local development

Serve the folder and open http://localhost:8000:

```sh
python3 -m http.server
```

After editing `sass/portfolio.scss`, recompile the CSS:

```sh
npx sass --no-source-map sass/portfolio.scss css/portfolio.css
```

## Deploying

The site is hosted on Firebase Hosting in the `briandaviddavidson-site` Google Cloud project. Deploy from the repo root:

```sh
npx firebase-tools deploy --only hosting
```

The `ignore` list in `firebase.json` keeps `.git`, the Sass sources, this README, the reference backup and other non-site files out of the deploy. If you add a file that shouldn't be public, add it to that list too.

## Domains

DNS is managed at Squarespace Domains.

| Domain | Serves |
|---|---|
| `briandaviddavidson.com` | This site (Firebase project `briandaviddavidson-site`) |
| `www.briandaviddavidson.com` | Redirects to `briandaviddavidson.com` |
| `time.briandaviddavidson.com` | [TIME Person of the Year app](https://github.com/briandaviddavidson/time-person-of-the-year) (Firebase project `time-person-of-the-year`) |
