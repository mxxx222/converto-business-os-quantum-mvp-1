# 🚀 Resend DNS-tietueiden automaattinen lisäysohje

**HUOM:** Tämä vaatii että olet kirjautunut hostingpalvelu.fi:hin selaimessa.

---

## 📋 DNS-tietueet lisättäväksi

Kopioi nämä tietueet DNS Zone Editoriin:

### **1. DKIM (TXT)**
```
Tyyppi: TXT
Nimi: resend._domainkey
Sisältö: p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDcfm95IULfHReEbyhuttYzpoUb6VhF0b9yLc0HAsDfkTDJ2ofZxuwLMzuUlqTKzb9bQ1ZR+C5BywccSPjMZKlIIxIzB3ZhoEP77Coj1H9Csaysu7yoWr9pxZBw5uL4UBq6DYaJiQYGV6WuEUE8B3kzCovsbGVSaIMjMSuWPq6BZwIDAQAB
TTL: Auto
```

### **2. MX (Mail Exchange)**
```
Tyyppi: MX
Nimi: send
Sisältö: feedback-smtp.eu-west-1.amazonses.com
Priority: 10
TTL: Auto
```

### **3. SPF (TXT)**
```
Tyyppi: TXT
Nimi: send
Sisältö: v=spf1 include:amazonses.com ~all
TTL: Auto
```

### **4. DMARC (TXT, Optional)**
```
Tyyppi: TXT
Nimi: _dmarc
Sisältö: v=DMARC1; p=none;
TTL: Auto
```

---

## 🎯 Nopeat vaiheet

1. **Kirjaudu hostingpalvelu.fi:hin** (jos et vielä ole)
2. **Avaa DNS Zone Editor** converto.fi:lle
3. **Lisää yllä olevat 4 tietuetta** yksitellen
4. **Odota 15-60 minuuttia**
5. **Vahvista Resendissä:** https://resend.com/domains → converto.fi → "Verify DNS Records"

---

**Valmis!** Kun DNS-tietueet on lisätty ja vahvistettu, Resend-optimointi on täysin valmis. 🎉

