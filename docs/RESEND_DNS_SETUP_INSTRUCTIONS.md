# 📧 Resend DNS-tietueiden lisäysohje

**Domain:** converto.fi  
**Tarkoitus:** Vahvistaa domain Resendissä sähköpostien lähettämistä varten

---

## 🎯 Tavoite

Lisätä DNS-tietueet hostingpalvelu.fi:hin, jotta Resend voi vahvistaa converto.fi-domainin.

---

## 📋 Lisättävät DNS-tietueet

### **1. Domain Verification (DKIM) - TXT**

**Tietue:**
- **Tyyppi:** TXT
- **Nimi:** `resend._domainkey`
- **Sisältö:** `p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDcfm95IULfHReEbyhuttYzpoUb6VhF0b9yLc0HAsDfkTDJ2ofZxuwLMzuUlqTKzb9bQ1ZR+C5BywccSPjMZKlIIxIzB3ZhoEP77Coj1H9Csaysu7yoWr9pxZBw5uL4UBq6DYaJiQYGV6WuEUE8B3kzCovsbGVSaIMjMSuWPq6BZwIDAQAB`
- **TTL:** Auto tai 3600

---

### **2. Sending Records**

#### **MX-tietue (Mail Exchange)**

**Tietue:**
- **Tyyppi:** MX
- **Nimi:** `send`
- **Sisältö:** `feedback-smtp.eu-west-1.amazonses.com`
- **Priority:** 10
- **TTL:** Auto tai 3600

---

#### **SPF-tietue (TXT)**

**Tietue:**
- **Tyyppi:** TXT
- **Nimi:** `send`
- **Sisältö:** `v=spf1 include:amazonses.com ~all`
- **TTL:** Auto tai 3600

---

#### **DMARC-tietue (TXT, Optional)**

**Tietue:**
- **Tyyppi:** TXT
- **Nimi:** `_dmarc`
- **Sisältö:** `v=DMARC1; p=none;`
- **TTL:** Auto tai 3600

**Huom:** Tämä on valinnainen, mutta suositeltu.

---

## 🚀 Toimenpideohje

### **Vaihe 1: Kirjaudu hostingpalvelu.fi:hin**

1. Mene: https://www.hostingpalvelu.fi/asiakkaat/index.php?rp=/login
2. Kirjaudu sisään käyttäen sähköpostiosoitetta ja salasanaa

### **Vaihe 2: Avaa DNS Zone Editor**

**Vaihtoehto A: Asiakassivujen kautta**
1. Valitse "Domains" tai "Verkkotunnukset"
2. Etsi `converto.fi` ja klikkaa sitä
3. Etsi "DNS Zone Editor" tai "DNS-tietueet"

**Vaihtoehto B: Hallintapaneelin kautta**
1. Kirjaudu hallintapaneeliin (cPanel)
2. Etsi "DNS Zone Editor" tai "Zone Editor"
3. Valitse `converto.fi`

### **Vaihe 3: Lisää DNS-tietueet**

Lisää jokainen tietue erikseen:

1. **DKIM (TXT):**
   - Klikkaa "Add Record" tai "Lisää tietue"
   - Tyyppi: TXT
   - Nimi: `resend._domainkey`
   - Sisältö: Kopioi pitkä merkkijono yllä
   - TTL: Auto
   - Tallenna

2. **MX (Mail Exchange):**
   - Klikkaa "Add Record"
   - Tyyppi: MX
   - Nimi: `send`
   - Sisältö: `feedback-smtp.eu-west-1.amazonses.com`
   - Priority: 10
   - TTL: Auto
   - Tallenna

3. **SPF (TXT):**
   - Klikkaa "Add Record"
   - Tyyppi: TXT
   - Nimi: `send`
   - Sisältö: `v=spf1 include:amazonses.com ~all`
   - TTL: Auto
   - Tallenna

4. **DMARC (TXT, Optional):**
   - Klikkaa "Add Record"
   - Tyyppi: TXT
   - Nimi: `_dmarc`
   - Sisältö: `v=DMARC1; p=none;`
   - TTL: Auto
   - Tallenna

### **Vaihe 4: Odota DNS-propagointia**

- DNS-tietueet voivat levitä 15 minuutista 24 tuntiin
- Yleensä tietueet ovat aktiivisia 1-2 tunnin sisällä

### **Vaihe 5: Vahvista Resendissä**

1. Mene: https://resend.com/domains
2. Etsi `converto.fi` domain
3. Klikkaa "Verify DNS Records" -painiketta
4. Odota vahvistusta (status muuttuu "not started" → "verified")

---

## ✅ Vahvistus

Kun DNS-tietueet on lisätty ja Resend on vahvistanut domainin:

- ✅ Status: `verified`
- ✅ Voit käyttää `info@converto.fi`, `hello@converto.fi` jne.
- ✅ Parempi deliverability (+10-15%)
- ✅ Professional branding

---

## 🔍 DNS-tietueiden tarkistus

Voit tarkistaa DNS-tietueet komentoriviltä:

```bash
# DKIM
dig TXT resend._domainkey.converto.fi

# MX
dig MX send.converto.fi

# SPF
dig TXT send.converto.fi

# DMARC
dig TXT _dmarc.converto.fi
```

---

## ❓ Ongelmatilanteet

**Jos DNS-tietueet eivät näy:**
- Odota 15-60 minuuttia (DNS propagation)
- Tarkista että olet lisännyt tietueet oikeaan domainiin
- Varmista että TTL on asetettu oikein

**Jos Resend ei vahvista:**
- Tarkista että kaikki 4 tietuetta on lisätty
- Odota 24 tuntia ja yritä uudelleen
- Tarkista DNS-tietueet dig-komennolla

---

## 📞 Tuki

Jos tarvitset apua:
- Hostingpalvelu.fi asiakaspalvelu: +358 (0) 9 42450 284
- Resend dokumentaatio: https://resend.com/docs/dashboard/domains/introduction

---

**Valmis!** Kun DNS-tietueet on lisätty ja vahvistettu, Resend-optimointi on täysin valmis. 🎉

