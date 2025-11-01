cripts/resend_dns_setup_automation.js</path>
<content">/**
 * Resend DNS Setup Automation Script
 * This script helps automate the DNS setup process for Resend email configuration
 * Target domain: converto.fi
 * DNS Provider: hostingpalvelu.fi
 */

class ResendDNSSetup {
  constructor() {
    this.dnsRecords = [
      {
        type: 'TXT',
        name: 'resend._domainkey',
        value: 'p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDcfm95IULfHReEbyhuttYzpoUb6VhF0b9yLc0HAsDfkTDJ2ofZxuwLMzuUlqTKzb9bQ1ZR+C5BywccSPjMZKlIIxIzB3ZhoEP77Coj1H9Csaysu7yoWr9pxZBw5uL4UBq6DYaJiQYGV6WuEUE8B3kzCovsbGVSaIMjMSuWPq6BZwIDAQAB',
        description: 'DKIM Domain Verification'
      },
      {
        type: 'MX',
        name: 'send',
        value: 'feedback-smtp.eu-west-1.amazonses.com',
        priority: '10',
        description: 'Mail Exchange Record'
      },
      {
        type: 'TXT',
        name: 'send',
        value: 'v=spf1 include:amazonses.com ~all',
        description: 'SPF Record for Sending'
      },
      {
        type: 'TXT',
        name: '_dmarc',
        value: 'v=DMARC1; p=none;',
        description: 'DMARC Policy Record'
      }
    ];
    
    this.currentStep = 0;
    this.setupComplete = false;
  }

  /**
   * Start the DNS setup automation process
   */
  startSetup() {
    console.log('🚀 Starting Resend DNS Setup for converto.fi');
    console.log('📧 Target Email Provider: Resend');
    console.log('🌐 DNS Provider: hostingpalvelu.fi');
    console.log('=' .repeat(50));
    
    this.showCurrentInstructions();
  }

  /**
   * Show instructions for the current step
   */
  showCurrentInstructions() {
    const step = this.currentStep + 1;
    
    switch (step) {
      case 1:
        this.showLoginInstructions();
        break;
      case 2:
        this.showDomainManagementInstructions();
        break;
      case 3:
        this.showDNSZoneInstructions();
        break;
      case 4:
        this.showDNSRecordInstructions();
        break;
      case 5:
        this.showVerificationInstructions();
        break;
      default:
        this.showCompletionInstructions();
        break;
    }
  }

  /**
   * Step 1: Login Instructions
   */
  showLoginInstructions() {
    console.log('\n🔐 STEP 1: LOGIN TO HOSTINGPALVELU.FI');
    console.log('=' .repeat(40));
    console.log('1. ✅ hostingpalvelu.fi should be open in your browser');
    console.log('2. Click on "Kirjaudu sisään" or "Login" button');
    console.log('3. Enter your hostingpalvelu.fi credentials:');
    console.log('   • Username: [Your username]');
    console.log('   • Password: [Your password]');
    console.log('4. Click "Kirjaudu sisään" or "Login"');
    console.log('\n⚡ After login, tell me "valmis" and I will continue!');
  }

  /**
   * Step 2: Domain Management Instructions
   */
  showDomainManagementInstructions() {
    console.log('\n🏠 STEP 2: NAVIGATE TO DOMAIN MANAGEMENT');
    console.log('=' .repeat(45));
    console.log('1. Look for "Domains" or "Toimialueet" in the main menu');
    console.log('2. Click on "Domains" or "Toimialueet"');
    console.log('3. Find "converto.fi" in your domain list');
    console.log('4. Click on "converto.fi"');
    console.log('5. Look for "DNS Settings" or "DNS-asetukset"');
    console.log('\n⚡ Tell me when you see the DNS management page!');
  }

  /**
   * Step 3: DNS Zone Instructions
   */
  showDNSZoneInstructions() {
    console.log('\n🔧 STEP 3: ACCESS DNS ZONE EDITOR');
    console.log('=' .repeat(40));
    console.log('1. Look for "DNS Zone Editor" or "DNS Zone -hallinta"');
    console.log('2. Click on "DNS Zone Editor"');
    console.log('3. You should see existing DNS records for converto.fi');
    console.log('4. Look for an "Add Record" or "Lisää tietue" button');
    console.log('\n⚡ Tell me when you see the DNS zone editor with existing records!');
  }

  /**
   * Step 4: DNS Record Instructions
   */
  showDNSRecordInstructions() {
    console.log('\n📝 STEP 4: ADD DNS RECORDS');
    console.log('=' .repeat(35));
    console.log('I will guide you through adding each DNS record:');
    console.log('');
    
    // Show first record
    const record = this.dnsRecords[this.currentRecordIndex || 0];
    if (record) {
      console.log(`🎯 ADDING RECORD ${ (this.currentRecordIndex || 0) + 1 } OF ${this.dnsRecords.length}`);
      console.log(`   Type: ${record.type}`);
      console.log(`   Name: ${record.name}`);
      console.log(`   Value: ${record.value}`);
      if (record.priority) {
        console.log(`   Priority: ${record.priority}`);
      }
      console.log(`   Description: ${record.description}`);
      console.log('\n📋 Steps to add this record:');
      console.log(`   1. Click "Add Record" or "Lisää tietue"`);
      console.log(`   2. Select Record Type: "${record.type}"`);
      console.log(`   3. Enter Name: "${record.name}"`);
      console.log(`   4. Enter Value: "${record.value}"`);
      if (record.priority) {
        console.log(`   5. Enter Priority: "${record.priority}"`);
      }
      console.log('   6. Click "Save" or "Tallenna"');
      console.log('\n⚡ Add this record and tell me when done!');
    }
  }

  /**
   * Step 5: Verification Instructions
   */
  showVerificationInstructions() {
    console.log('\n✅ STEP 5: VERIFY DNS SETUP');
    console.log('=' .repeat(30));
    console.log('1. All 4 DNS records have been added');
    console.log('2. Wait 15-30 minutes for DNS propagation');
    console.log('3. Go to Resend Dashboard: https://resend.com/dashboard');
    console.log('4. Navigate to "Domains" → "converto.fi"');
    console.log('5. Click "Verify DNS Records"');
    console.log('6. Status should change from "not started" to "verified"');
    console.log('\n🎉 DNS setup complete!');
  }

  /**
   * Completion Instructions
   */
  showCompletionInstructions() {
    console.log('\n🎉 DNS SETUP COMPLETE!');
    console.log('=' .repeat(30));
    console.log('✅ All DNS records added to hostingpalvelu.fi');
    console.log('✅ DNS propagation in progress');
    console.log('✅ Ready for Resend verification');
    console.log('\n📧 Expected Results:');
    console.log('• info@converto.fi will work');
    console.log('• hello@converto.fi will work');
    console.log('• All Converto Business OS email features will be functional');
    console.log('\n🔍 Next Steps:');
    console.log('1. Wait 15-30 minutes for DNS propagation');
    console.log('2. Verify DNS records in Resend dashboard');
    console.log('3. Test sending emails from the application');
  }

  /**
   * Manual record addition guidance
   */
  getManualRecordData() {
    return this.dnsRecords.map((record, index) => ({
      number: index + 1,
      type: record.type,
      name: record.name,
      value: record.value,
      priority: record.priority || '',
      description: record.description
    }));
  }

  /**
   * Get current status
   */
  getStatus() {
    return {
      currentStep: this.currentStep + 1,
      totalSteps: 5,
      currentRecordIndex: this.currentRecordIndex || 0,
      totalRecords: this.dnsRecords.length,
      setupComplete: this.setupComplete,
      dnsRecords: this.getManualRecordData()
    };
  }
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.ResendDNSSetup = ResendDNSSetup;
  console.log('✅ ResendDNSSetup loaded! Run: new ResendDNSSetup().startSetup()');
}