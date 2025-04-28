# Space Babies/Joost Baaij: Engineer for Live Sound

> **Tagline:** *Luisteren. Laden. Live.*  
> **Promise:** *Kraakhelder geluid, nul stress.*

Welkom bij de code & content‑basis van **spacebabies.nl**. Dit document legt **waarom** de site is opgebouwd zoals hij is en **hoe** je – als developer of AI‑agent – nieuwe content kunt toevoegen zonder de positionering te verwateren.

---

## Project‑doel

*Een booking‑machine voor Joost Baaij, live‑geluidstechnicus uit Amsterdam.*  
De site moet binnen vijf seconden duidelijk maken:

1. **Wat krijg ik?** – kraakhelder geluid zonder stress.  
2. **Voor wie?** – side‑stages, break‑outs, kleinere zalen met een top‑PA.  
3. **Wat nu?** – Plan een vrijblijvende 15‑min call.

Alles, echt, álles, moet in het teken staan van de conversie van bezoeker naar klant.

---

## Brand‑DNA

| Kernwaarde                | Wat het betekent in copy/design                         |
|---------------------------|----------------------------------------------------------|
| Luisteren staat voorop    | Begin elke sectie met het voordeel voor het publiek.     |
| Voorbereiding is super‑power | Showfile & input‑list worden expliciet benoemd.         |
| IT‑brein                  | Joost heeft een IT-achtergrond en is Digitally Native.    |
| Autonomiteit onder supervisie | Toon dat Joost zelfstandig draait én communiceert.    |
| Fun ≠ onprofessioneel     | 90’s‑raver‑kleuraccent oké; copy blijft helder en strak. |

> **No‑go’s:** overdadige emoji, gear‑fetish zonder klantvoordeel, maskuline road‑dog vibe.

---

## Inhouds‑architectuur

Multilang is een doel op middellange termijn.

```
/content
 ├─ index.nl.md  (NL homepage)
 ├─ index.en.md  (EN homepage)
 ├─ nl/
 └─ en/ (mirror)
```

* **Identieke structuur** voor NL en EN; vertaal alleen content.

### Hero‑sectie regels
* **H1:** `Luisteren. Laden. Live.` (of EN: `Listen. Load. Live.`)
* **H2 (sub‑headline):** `Kraakhelder geluid, nul stress.`
* **Body‑copy:** Max 45 woorden, eindigt met primaire CTA‑knop.

### Services‑cards
Dit zijn tevens de doelgroepen:

* **Concert- en theaterzalen**
* **Festival side-stages**
* **Zakelijke panels**

> Voeg **max 3 bullets** toe; elk bullet start met vet kernwoord.

Alles draait om de funnel, onthou dat deze website een _boekingsmachine_ is.
---

## SEO‑richtlijnen

* Paginatitels: `Live geluidstechnicus Amsterdam – Joost Baaij` etc.  
* Alt‑tags formaat: `"{event} FOH mix Joost Baaij (Space Babies Audio)"`.  
* `Schema.org` `Person` + `ProfessionalService` JSON‑LD in `<head>`.

---

## Deployment

Een repo push triggert een deploy naar Netlify.

---

## Contact

Voor vragen: **joost@spacebabies.nl**  

---

Happy shipping – en onthoud: *elk detail horen ze, stress horen ze ook.*

