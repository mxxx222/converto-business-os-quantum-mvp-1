# Kilo Code API - Kuvanluontiasetukset

## Yleistä

Kilo Code API -integraatio mahdollistaa kuvanluonnin Converto Business OS -järjestelmässä.

## API-avaimen hankkiminen

### Vaiheet:

1. **Kirjaudu sisään app.kilocode.ai**
   - Siirry osoitteeseen: https://app.kilocode.ai/users/sign_in
   - Kirjaudu sisään käyttämällä:
     - Google-tiliä
     - GitHub-tiliä
     - GitLab-tiliä
     - LinkedIn-tiliä
     - Enterprise SSO

2. **Hae API-avain**
   
   **Vaihtoehto A: VS Code -laajennuksen kautta (Suositeltu)**
   - Kun käytät Kilo Code VS Code -laajennusta ensimmäistä kertaa
   - Laajennus ohjaa sinut rekisteröintiprosessiin
   - API-avain kopioidaan automaattisesti laajennukseen
   - Web-pohjaisille IDE:ille API-avain näytetään ja sen voi kopioida manuaalisesti

   **Vaihtoehto B: Manuaalinen haku selaimessa**
   - Kirjaudu sisään osoitteeseen: https://app.kilocode.ai
   - Etsi profiili/asetukset -sivulta API-avain
   - Jos et löydä suoraan, tarkista dokumentaatio: https://kilocode.ai/docs/providers/kilocode

3. **Kopioi API-avain**
   - Kopioi API-avain heti kun se näytetään
   - **HUOM:** API-avain näytetään vain kerran web-pohjaisille IDE:ille
   - Tallenna avain turvalliseen paikkaan ennen käyttöä

## Konfigurointi

### Backend (.env)

Lisää seuraavat muuttujat `.env`-tiedostoon:

```bash
KILO_CODE_API_KEY=your_api_key_here
KILO_CODE_API_BASE=https://api.kilocode.com
IMAGE_GENERATION_ENABLED=true
```

### Cursor Settings (cursor-settings.json)

Kuvanluontiasetukset on konfiguroitu `cursor-settings.json`-tiedostossa:

```json
{
  "imageGeneration": {
    "provider": "kilocode",
    "apiKey": "your_api_key_here",
    "apiBase": "https://api.kilocode.com",
    "enabled": true,
    "defaultModel": "image-generation-v1",
    "maxImages": 4,
    "imageSize": "1024x1024"
  }
}
```

## Käyttö

Kun API-avain on konfiguroitu, voit käyttää kuvanluontia:

1. **Backend:** API-avain ladataan automaattisesti `backend/config.py`-asetuksista
2. **Frontend:** Kuvanluontia voi käyttää API-endpointin kautta

## Tuki

Jos tarvitset apua:
- **Dokumentaatio:** https://kilocode.ai/docs/providers/kilocode
- **API Provider -ohjeet:** https://kilocode.ai/docs/getting-started/connecting-api-provider
- **Yhteystiedot:** hi@kilocode.ai
- **Tarkista:** `backend/config.py` konfiguraatio

## Nopeat linkit

- **Kirjautuminen:** https://app.kilocode.ai/users/sign_in
- **Dokumentaatio:** https://kilocode.ai/docs
- **Kilo Code Provider:** https://kilocode.ai/docs/providers/kilocode

## Turvallisuus

- **Älä koskaan** commitoi API-avainta versionhallintaan
- Käytä `.env`-tiedostoa paikalliseen kehitykseen
- Käytä Render/Vercel environment variables tuotannossa
- Kiertä API-avaimet säännöllisesti

