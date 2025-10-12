# ✅ FINAL PRE-LAUNCH CHECKLIST

Complete this checklist before submitting to App Store and Play Store.

---

## 🎯 CRITICAL (Must Complete)

### 1. Domain & SSL
- [ ] `app.converto.fi` resolves correctly
- [ ] `api.converto.fi` resolves correctly
- [ ] SSL certificate valid (green padlock)
- [ ] CORS configured for frontend domain
- [ ] DNS propagation complete (check: https://dnschecker.org)

### 2. Legal Pages
- [ ] Privacy Policy published at `https://converto.fi/privacy`
- [ ] Terms of Service published at `https://converto.fi/terms`
- [ ] Support page published at `https://converto.fi/support`
- [ ] All links accessible without login

### 3. Email & Support
- [ ] `support@converto.fi` email active
- [ ] Auto-reply configured
- [ ] Test email sent and received
- [ ] Support ticket system ready (optional)

### 4. Backend (Render)
- [ ] Backend deployed to Render
- [ ] Environment variables configured:
  - [ ] `DATABASE_URL`
  - [ ] `OPENAI_API_KEY`
  - [ ] `STRIPE_SECRET_KEY`
  - [ ] `STRIPE_WEBHOOK_SECRET`
  - [ ] `SENTRY_DSN` (optional)
- [ ] Health check passes: `curl https://api.converto.fi/health`
- [ ] Database migrations run
- [ ] Seed data loaded (if needed)

### 5. Frontend (Render)
- [ ] Frontend deployed to Render
- [ ] Environment variables configured:
  - [ ] `NEXT_PUBLIC_API_BASE=https://api.converto.fi`
  - [ ] `NEXT_PUBLIC_SENTRY_DSN` (optional)
- [ ] Build successful
- [ ] Homepage loads without errors
- [ ] Console has no critical errors

### 6. Core Features
- [ ] **OCR:** Upload receipt → text extracted
- [ ] **VAT:** Calculation shows correct Finnish rates
- [ ] **Legal:** Finlex rules display
- [ ] **Billing:** Stripe checkout works (test mode)
- [ ] **Dashboard:** KPIs display correctly
- [ ] **Auth:** Login/logout works

### 7. Mobile (iOS)
- [ ] App icon 1024×1024 added to Xcode
- [ ] Bundle ID: `fi.converto.app`
- [ ] Signing configured (Team + Certificate)
- [ ] Build successful in Xcode
- [ ] TestFlight build uploaded
- [ ] 2+ testers invited and tested
- [ ] No critical crashes

### 8. Mobile (Android)
- [ ] Keystore created and backed up
- [ ] `gradle.properties` configured with keystore
- [ ] `play-service-account.json` added to Fastlane
- [ ] Bundle ID: `fi.converto.app`
- [ ] AAB build successful
- [ ] Internal track uploaded
- [ ] 2+ testers invited and tested
- [ ] No critical crashes

### 9. Store Assets
- [ ] App icon designed (512×512 and 1024×1024)
- [ ] Screenshots captured (6 images minimum)
- [ ] Feature graphic created (1024×500 for Android)
- [ ] App description written (see STORE_SUBMISSION_PACK.md)
- [ ] Keywords researched
- [ ] Promo video created (optional)

### 10. Compliance
- [ ] Privacy policy reviewed by legal (optional)
- [ ] GDPR compliance verified
- [ ] Data retention policy defined
- [ ] Cookie consent implemented (if applicable)
- [ ] Terms of service reviewed

---

## 🔧 RECOMMENDED (Should Complete)

### Analytics & Monitoring
- [ ] Sentry configured for error tracking
- [ ] Analytics tool installed (Plausible/PostHog)
- [ ] Uptime monitoring (UptimeRobot/Pingdom)
- [ ] Performance monitoring (optional)

### Testing
- [ ] Lighthouse score > 90 (Performance, Accessibility)
- [ ] Mobile responsive on all screen sizes
- [ ] Cross-browser tested (Chrome, Safari, Firefox)
- [ ] Slow network tested (3G simulation)
- [ ] Offline mode tested (PWA)

### Security
- [ ] API rate limiting enabled
- [ ] SQL injection prevention verified
- [ ] XSS protection enabled
- [ ] CSRF tokens implemented
- [ ] Secrets not exposed in frontend
- [ ] `.env` files not committed to Git

### Performance
- [ ] Images optimized (WebP format)
- [ ] Lazy loading implemented
- [ ] CDN configured (optional)
- [ ] Database indexes added
- [ ] API response times < 500ms

### Backup & Recovery
- [ ] Database backup scheduled (Render auto-backups)
- [ ] Backup restoration tested
- [ ] Disaster recovery plan documented

---

## 📱 STORE-SPECIFIC

### iOS App Store
- [ ] App Store Connect account active
- [ ] App created in App Store Connect
- [ ] Metadata filled (name, subtitle, description)
- [ ] Keywords added
- [ ] Screenshots uploaded (6.7" and 5.5")
- [ ] App icon uploaded
- [ ] Privacy details completed
- [ ] Age rating set (4+)
- [ ] Support URL added
- [ ] Marketing URL added
- [ ] Review notes with test account provided
- [ ] TestFlight external testing complete
- [ ] Ready for submission

### Google Play Console
- [ ] Play Console account active ($25 paid)
- [ ] App created in Play Console
- [ ] Store listing filled
- [ ] Short description (80 chars)
- [ ] Full description (4000 chars)
- [ ] Screenshots uploaded (1080×1920)
- [ ] Feature graphic uploaded (1024×500)
- [ ] App icon uploaded (512×512)
- [ ] Content rating completed
- [ ] Privacy policy URL added
- [ ] Target audience set (18+)
- [ ] App category set (Business)
- [ ] Pricing set (Free with in-app purchases)
- [ ] Countries selected (Finland + EU)
- [ ] Internal testing complete
- [ ] Ready for production

---

## 🧪 MANUAL TESTING SCRIPT

### Test Account
```
Email: demo@converto.fi
Password: Demo2025!
Tenant: tenant_demo_001
```

### Test Flow (15 minutes)

1. **Login** (2 min)
   - [ ] Navigate to https://app.converto.fi
   - [ ] Login with test account
   - [ ] Dashboard loads

2. **OCR Scan** (3 min)
   - [ ] Navigate to OCR page
   - [ ] Upload test receipt image
   - [ ] Wait for processing
   - [ ] Verify text extracted correctly
   - [ ] Check VAT calculation

3. **VAT Calculator** (2 min)
   - [ ] Navigate to VAT page
   - [ ] View current rates
   - [ ] Check calculations

4. **Legal Compliance** (2 min)
   - [ ] Navigate to Legal page
   - [ ] View Finlex rules
   - [ ] Sync button works

5. **Billing** (3 min)
   - [ ] Navigate to Billing page
   - [ ] View subscription plans
   - [ ] Click "Valitse" on Pro plan
   - [ ] Stripe checkout opens
   - [ ] Use test card: 4242 4242 4242 4242
   - [ ] Complete payment
   - [ ] Redirect to success page

6. **Gamification** (1 min)
   - [ ] View gamify widget
   - [ ] Check points display
   - [ ] Verify streak counter

7. **Logout** (1 min)
   - [ ] Logout
   - [ ] Verify redirect to login

8. **Mobile (iOS/Android)** (1 min)
   - [ ] Open app on device
   - [ ] Login
   - [ ] Navigate to 2-3 pages
   - [ ] No crashes

---

## 🚨 COMMON REJECTION REASONS

### iOS
- ❌ **3.1.3(b) - SaaS Apps:** Must use in-app purchases (NOT applicable if web-based)
- ❌ **2.1 - App Completeness:** App crashes or has broken features
- ❌ **5.1.1 - Privacy:** Missing privacy policy or incorrect data collection disclosure
- ❌ **4.2 - Minimum Functionality:** App is just a web wrapper (ensure native features)

**How to avoid:**
- ✅ Clearly state it's a web-based SaaS in review notes
- ✅ Ensure app doesn't crash during review
- ✅ Privacy policy must be accessible without login
- ✅ Add native features (push notifications, offline mode)

### Android
- ❌ **Privacy Policy:** Not accessible or missing required info
- ❌ **Content Rating:** Incorrect or missing
- ❌ **Permissions:** Requesting unnecessary permissions
- ❌ **Crashes:** App crashes on startup or during use

**How to avoid:**
- ✅ Privacy policy URL must be public
- ✅ Complete content rating questionnaire accurately
- ✅ Only request necessary permissions
- ✅ Test on multiple devices before submission

---

## 📊 LAUNCH DAY CHECKLIST

### Morning of Launch
- [ ] Check all services are up (Render, Database, Stripe)
- [ ] Monitor error logs (Sentry)
- [ ] Prepare support team
- [ ] Social media posts ready
- [ ] Email announcement ready
- [ ] Press release ready (optional)

### During Launch
- [ ] Monitor app store reviews
- [ ] Respond to support emails within 1 hour
- [ ] Track analytics (downloads, signups, errors)
- [ ] Watch for crash reports

### End of Day
- [ ] Review analytics
- [ ] Prioritize bug fixes
- [ ] Plan hotfix if needed
- [ ] Thank early adopters

---

## 🎉 POST-LAUNCH (Week 1)

- [ ] Day 1: Monitor closely, fix critical bugs
- [ ] Day 2: Respond to all reviews
- [ ] Day 3: Analyze user behavior
- [ ] Day 4: Plan first update
- [ ] Day 5: Collect feedback
- [ ] Day 6: Implement quick wins
- [ ] Day 7: Prepare update (1.0.1)

---

## 📞 EMERGENCY CONTACTS

**Render Support:** https://render.com/support  
**Stripe Support:** https://support.stripe.com/  
**Apple Developer:** https://developer.apple.com/contact/  
**Google Play:** https://support.google.com/googleplay/android-developer/  
**Sentry:** https://sentry.io/support/  

---

## 🔗 QUICK LINKS

- **Frontend:** https://app.converto.fi
- **Backend:** https://api.converto.fi
- **Health Check:** https://api.converto.fi/health
- **Privacy Policy:** https://converto.fi/privacy
- **Terms:** https://converto.fi/terms
- **Support:** support@converto.fi
- **GitHub:** https://github.com/mxxx222/converto-business-os-quantum-mvp-1

---

**✅ When all checkboxes are complete, you're ready to submit!**

**🚀 Good luck with your launch!**

