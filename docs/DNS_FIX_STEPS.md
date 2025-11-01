# 🔧 DNS-korjaus - Askel askeleelta

## 📋 **Tilanne:**
- **Domain:** herbspot.fi
- **Ongelma:** MX-tietue osoittaa `mailwp23.hostingpalvelu.fi` (väärä)
- **Tulisi olla:** `mx.zoho.com` ja `mx2.zoho.com`

---

## ✅ **VAIHE 1: Kirjaudu Hostingpalvelu.fi:hin**

**Selaimessa on jo kirjautumislomake auki:**
- **Email:** max@herbspot.fi (täytetty)
- **Salasana:** [Syötä salasana]

**Kun olet kirjautunut:**
1. Mene: **Domainit** → **herbspot.fi**
2. Klikkaa: **DNS-asetukset** tai **DNS-tietueet**

---

## ✅ **VAIHE 2: Poista vanha MX-tietue**

1. **Etsi:** MX-tietueet -lista
2. **Löydä:** `mailwp23.hostingpalvelu.fi` (priority 0)
3. **Poista** tämä tietue
4. **Tallenna** muutokset

---

## ✅ **VAIHE 3: Lisää Zoho Mailin MX-tietueet**

**Lisää ensimmäinen MX-tietue:**
- **Host:** @ (tai jätä tyhjäksi jos @ ei toimi)
- **Type:** MX
- **Priority:** 10
- **Value:** mx.zoho.com
- **TTL:** 3600 (tai automaattinen)

**Lisää toinen MX-tietue:**
- **Host:** @ (tai jätä tyhjäksi)
- **Type:** MX
- **Priority:** 20
- **Value:** mx2.zoho.com
- **TTL:** 3600 (tai automaattinen)

**Tallenna muutokset**

---

## ✅ **VAIHE 4: Päivitä SPF-tietue**

1. **Etsi:** TXT-tietueet -lista
2. **Löydä:** SPF-tietue joka alkaa `v=spf1`
3. **Nykyinen:** `v=spf1 +a +mx +ip4:31.217.192.197 +ip4:31.217.192.198 ~all`
4. **Muuta:** `v=spf1 include:zoho.com ~all`
5. **Tallenna** muutokset

---

## ✅ **VAIHE 5: Testaa muutokset**

**Odota 15-30 min DNS-propagation, sitten:**

```bash
# Tarkista MX-tietueet:
dig MX herbspot.fi

# Tarkista SPF:
dig TXT herbspot.fi | grep spf
```

**Odotettu tulos:**
```
herbspot.fi mail exchanger = 10 mx.zoho.com.
herbspot.fi mail exchanger = 20 mx2.zoho.com.
```

---

## 📞 **Jos tarvitset apua:**

- **Hostingpalvelu.fi tuki:** asiakaspalvelu@hostingpalvelu.fi
- **Puhelin:** +358 (0) 9 42450 284

---

**Päivitetty:** 2025-11-01

