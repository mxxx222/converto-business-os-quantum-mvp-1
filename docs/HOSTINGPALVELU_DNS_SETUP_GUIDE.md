ocs/HOSTINGPALVELU_DNS_SETUP_GUIDE.md</path>
<content"># 🚀 HOSTINGPALVELU DNS SETUP - CONVERTO.FI

## 📧 **RESEND DNS CONFIGURATION**
**Target Domain**: converto.fi  
**DNS Provider**: hostingpalvelu.fi  
**Management Panel**: https://hostingpalvelu.fi/hallinta/toimialueet

---

## 🔐 **STEP 1: LOGIN TO HOSTINGPALVELU**

**Currently Open**: hostingpalvelu.fi/hallinta/toimialueet

### Actions:
1. **Login with your hostingpalvelu credentials**
2. **Navigate to "Toimialueet" (Domains) section**
3. **Find "converto.fi" in your domain list**

---

## 🎯 **STEP 2: ACCESS DNS MANAGEMENT FOR CONVERTO.FI**

### Once Logged In:
1. **Click on "converto.fi"** in the domains list
2. **Look for "DNS-hallinta" or "DNS-asetukset"** (DNS Management)
3. **Click on DNS management option**
4. **You should see existing DNS records**

---

## 📝 **STEP 3: ADD THE 4 REQUIRED DNS RECORDS**

**IMPORTANT**: Add these records exactly as specified:

### **📋 Record 1: DKIM Verification**
```
Record Type: TXT
Name: resend._domainkey
Value: p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDcfm95IULfHReEbyhuttYzpoUb6VhF0b9yLc0HAsDfkTDJ2ofZxuwLMzuUlqTKzb9bQ1ZR+C5BywccSPjMZKlIIxIzB3ZhoEP77Coj1H9Csaysu7yoWr9pxZBw5uL4UBq6DYaJiQYGV6WuEUE8B3kzCovsbGVSaIMjMSuWPq6BZwIDAQAB
TTL: 300 (5 minutes)
```

### **📋 Record 2: Mail Exchange**
```
Record Type: MX
Name: send
Value: feedback-smtp.eu-west-1.amazonses.com
Priority: 10
TTL: 300
```

### **📋 Record 3: SPF Record**
```
Record Type: TXT
Name: send
Value: v=spf1 include:amazonses.com ~all
TTL: 300
```

### **📋 Record 4: DMARC Policy**
```
Record Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none;
TTL: 300
```

---

## 💾 **STEP 4: SAVE DNS RECORDS**

### In hostingpalvelu Panel:
1. **Save all DNS changes**
2. **Wait for confirmation** that records are saved
3. **Note the TTL times** (shorter TTL = faster propagation)

---

## ✅ **STEP 5: VERIFY DNS PROPAGATION**

### Tools to Check:
1. **Use hostingpalvelu's DNS checker** (if available)
2. **Or use external tools:**
   - https://dnschecker.org
   - https://mxtoolbox.com
3. **Wait 15-30 minutes minimum**

### What to Verify:
- All 4 records are visible
- Record values match exactly
- No errors reported

---

## 🔍 **STEP 6: RESEND VERIFICATION**

### After DNS Propagation:
1. **Go to Resend Dashboard**: https://resend.com/dashboard
2. **Navigate to Domains**
3. **Select "converto.fi"**
4. **Click "Verify DNS Records"**
5. **Status should change to "verified"**

---

## 🎉 **EXPECTED RESULTS**

### ✅ **Success Indicators:**
- DNS records saved in hostingpalvelu
- Records propagate within 15-30 minutes
- Resend shows "verified" status
- Can send emails from info@converto.fi

### 📊 **Business Impact:**
- **Professional Email**: @converto.fi addresses work
- **Deliverability**: Higher inbox placement rates
- **Branding**: Consistent email from your domain
- **Trust**: Customers see emails from your domain

---

## 🔧 **HOSTINGPALVELU-SPECIFIC TIPS**

### **Interface Navigation:**
- **Domains**: "Toimialueet" in main menu
- **DNS Management**: Look for DNS icons or "DNS" labels
- **Adding Records**: Usually "+ Add" or "Lisää tietue" button
- **Save Changes**: "Tallenna" or "Save" button

### **If You Can't Find DNS Management:**
- Check if domain has proper permissions
- Contact hostingpalvelu support for DNS access
- Verify domain is active and paid for

---

## ⏰ **TIMELINE EXPECTATIONS**

- **DNS Setup**: 10-15 minutes
- **DNS Propagation**: 15-30 minutes (300 TTL)
- **Full Verification**: 1-24 hours
- **Email Testing**: Immediately after verification

---

## 🆘 **TROUBLESHOOTING**

### **DNS Records Not Saving:**
- Ensure you're logged in with proper permissions
- Check if domain management is enabled
- Verify domain status is "active"

### **Verification Fails:**
- Wait longer for propagation (up to 24 hours)
- Double-check record values are exact
- Use DNS checker tools to verify

### **Can't Find Domain:**
- Check domain list carefully
- Look for similar names (case sensitive)
- Contact support if domain missing

---

## 📞 **SUPPORT**

### **If You Need Help:**
1. **Hostingpalvelu Support**: Check their help system
2. **DNS Verification**: Use online DNS checker tools
3. **Resend Support**: https://resend.com/support

---

## ✅ **COMPLETION CHECKLIST**

- [ ] Login to hostingpalvelu.fi/hallinta
- [ ] Navigate to "Toimialueet" (Domains)
- [ ] Find and select "converto.fi"
- [ ] Open DNS management for converto.fi
- [ ] Add DKIM TXT record
- [ ] Add MX record
- [ ] Add SPF TXT record
- [ ] Add DMARC TXT record
- [ ] Save all DNS changes
- [ ] Wait for propagation (15-30 min)
- [ ] Verify in Resend dashboard
- [ ] Test email functionality

**Ready to complete DNS setup in hostingpalvelu management panel!**