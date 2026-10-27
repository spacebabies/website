# Space Babies / Joost Baaij

Broncode en content van [spacebabies.nl](https://www.spacebabies.nl), de website van Joost Baaij, zelfstandig geluidstechnicus in Amsterdam.

## Positionering en content

[POSITIONING.md](POSITIONING.md) is de leidraad voor merkpositionering, gewenste opdrachten en de afweging tussen werkplezier, zakelijke opbrengst en belasting. Gebruik dit document bij keuzes over doelgroepen, diensten, portfolio en websiteteksten.

[AGENTS.md](AGENTS.md) bevat de schrijf- en hertalingsrichtlijnen, metadata-afspraken en instructies voor het werken aan de site.

## Techniek en structuur

De site gebruikt Hugo, Tailwind CSS en PostCSS en heeft Nederlandse en Engelse content.

- `content/_index.nl.md` en `content/_index.en.md`: homepage.
- `content/gigs/YYYY/MM/event-name-slug/`: gigverslagen, met `index.md` voor Nederlands en `index.en.md` voor Engels.
- `data/services.nl.yaml` en `data/services.en.yaml`: diensten op de homepage.
- `config.yml`: siteconfiguratie, taalinstellingen en algemene metadata.
- `layouts/`: Hugo-templates.
- `assets/css/main.css`: CSS-bronbestand. Maak hier ook een tracked wijziging wanneer je Tailwind-klassen in templates of content aanpast, zodat Hugo/PostCSS de uitvoer opnieuw genereert.

## Build en deployment

Installeer Hugo Extended 0.168.0 met `mise install` en de Node-dependencies met `npm install` (Node.js 22.23.1, gelijk aan Netlify). Bouw de site met `mise exec -- hugo --gc --minify` en start de lokale server met `mise exec -- hugo server`.

De Hugo-versie staat in `.tool-versions` en `netlify.toml`; houd die gelijk bij upgrades. De bijgewerkte Browserslist-versie in `package-lock.json` kan omgaan met Hugo's Node-permissies wanneer PostCSS naar browserconfiguratie zoekt.

De Netlify-buildinstellingen staan in [netlify.toml](netlify.toml). Een push kan een deployment triggeren; werk op een aparte branch en laat Joost zelf de pull request aanmaken.

## Contact

[joost@spacebabies.nl](mailto:joost@spacebabies.nl)
