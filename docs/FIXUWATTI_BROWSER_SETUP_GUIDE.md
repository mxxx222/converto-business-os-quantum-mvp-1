ocs/FIXUWATTI_BROWSER_SETUP_GUIDE.md</path>
<content">
# 🎯 FixUatti.fi DNS Setup - Browser Implementation Guide

**Status:** ✅ Browser Ready - hostingpalvelu.fi open in browser
**Target:** Configure fixuwatti.fi for Zoho Mail
**Time:** 5-10 minutes

## 🌐 **Current Browser State**
- **URL:** hostingpalvelu.fi (open in browser)
- **Next:** DNS Zone Editor interface

---

## 🔐 **Step 1: Login to hostingpalvelu.fi**

### In your browser:
1. **If not logged in:**
   - Enter your **email** (likely your domain owner email)
   - Enter your **password**
   - Click **"Kirjaudu"** or **"Login"**

2. **Expected result:** Dashboard/home page appears

---

## 📁 **Step 2: Navigate to Domain Management**

### Look for these sections in the dashboard:
- **"Domainit"** (Domains)
- **"Domains"**
- **"Domain Management"**

### Click on any of these:
1. **Click:** Domain management section
2. **Expected result:** Domain list appears

---

## 🔍 **Step 3: Find fixuwatti.fi Domain**

### In the domain list:
1. **Look for:** `fixuwatti.fi` in the list
2. **Click:** on fixuwatti.fi domain
3. **Expected result:** Domain details page appears

### Alternative if not visible:
- **Search/Filter:** Use search box to find "fixuwatti"
- **Pagination:** Check multiple pages if domain list is long

---

## ⚙️ **Step 4: Access DNS Zone Editor**

### Look for DNS management options:
- **"DNS Zone Editor"**
- **"DNS-asetukset"** (DNS Settings)
- **"DNS Management"**
- **"Zone Editor"**

### Click on DNS management:
1. **Click:** DNS Zone Editor or DNS Settings
2. **Expected result:** DNS records interface appears

---

## 📧 **Step 5: Configure MX Records for Zoho Mail**

### Add First MX Record:
1. **Click:** "Add MX Record" or "Lisää MX"
2. **Fill in the form:**
   ```
   Host: @ (or leave blank)
   Type: MX
   Priority: 10
   Destination: mx.zoho.com
   TTL: 3600 (or default)
   ```
3. **Click:** "Save" or "Tallenna"

### Add Second MX Record:
1. **Click:** "Add MX Record" again
2. **Fill in the form:**
   ```
   Host: @ (or leave blank)
   Type: MX
   Priority: 20
   Destination: mx2.zoho.com
   TTL: 3600 (or default)
   ```
3. **Click:** "Save" or "Tallenna"

---

## 📝 **Step 6: Update SPF Record**

### Locate existing SPF record:
1. **Look for:** TXT records section
2. **Find:** Record containing "v=spf1"
3. **Edit:** Click edit/pencil icon on that record

### Update SPF value:
```
Record Type: TXT
Host: @
Value: v=spf1 include:zoho.com ~all
TTL: 3600 (or default)
```

### If no SPF record exists:
1. **Click:** "Add TXT Record"
2. **Fill in:**
   ```
   Host: @
   Type: TXT
   Value: v=spf1 include:zoho.com ~all
   TTL: 3600 (or default)
   ```

---

## 💾 **Step 7: Save All Changes**

### In DNS Zone Editor:
1. **Look for:** "Save All" or "Apply Changes"
2. **Click:** Save/Apply button
3. **Expected result:** Confirmation message appears

### Verify saved changes:
1. **Check:** DNS records list
2. **Confirm:** Both MX records are visible
3. **Confirm:** SPF record is updated

---

## 🧪 **Step 8: Verification**

### In the browser:
1. **Refresh:** DNS zone editor page
2. **Verify:** Records are saved:
   ```
   ✅ mx.zoho.com (Priority: 10)
   ✅ mx2.zoho.com (Priority: 20)
   ✅ v=spf1 include:zoho.com ~all
   ```

### External verification (after 15-30 minutes):
```bash
# Run in terminal:
dig MX fixuwatti.fi
# Should show:
# fixuwatti.fi. 3600 IN MX 10 mx.zoho.com.
# fixuwatti.fi. 3600 IN MX 20 mx2.zoho.com.
```

---

## 🎯 **Complete Configuration Summary**

### Final DNS Records for fixuwatti.fi:
```
MX 10 mx.zoho.com
MX 20 mx2.zoho.com
TXT v=spf1 include:zoho.com ~all
```

### Expected Result:
- ✅ Email routing to Zoho Mail
- ✅ SPF validation enabled
- ✅ Ready for Zoho Mail setup

---

## 📞 **Troubleshooting**

### If MX records don't save:
- **Check:** Host field (@ vs blank)
- **Try:** Different MX record button names
- **Contact:** hostingpalvelu.fi support

### If SPF record won't update:
- **Try:** Different TXT field approach
- **Use:** SPF check tools online
- **Verify:** Record syntax

### If domain not found:
- **Check:** Domain ownership
- **Verify:** Domain is active in account
- **Contact:** hostingpalvelu.fi support

---

**🚀 Ready to implement! Browser is already open to hostingpalvelu.fi**

**⏰ Expected time:** 5-10 minutes
**🧪 Test after:** 15-30 minutes
**✅ Result:** Professional email via Zoho Mail
