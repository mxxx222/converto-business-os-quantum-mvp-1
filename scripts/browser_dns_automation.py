#!/usr/bin/env python3
"""
Browser Automation for FixUatti.fi DNS Setup
Automates hostingpalvelu.fi DNS configuration for Zoho Mail integration
"""

import asyncio
import os
import json
from playwright.async_api import async_playwright

class FixUattiDNSAutomation:
    def __init__(self):
        self.hostingpalvelu_url = "https://hostingpalvelu.fi"
        self.domain = "fixuwatti.fi"
        self.zoho_mx_records = [
            {"host": "@", "priority": "10", "value": "mx.zoho.com"},
            {"host": "@", "priority": "20", "value": "mx2.zoho.com"}
        ]
        self.spf_record = "v=spf1 include:zoho.com ~all"
        
    async def login_to_hostingpalvelu(self, page, email, password):
        """Login to hostingpalvelu.fi"""
        print("🔐 Logging into hostingpalvelu.fi...")
        
        try:
            # Navigate to login page
            await page.goto(self.hostingpalvelu_url, wait_until="networkidle")
            
            # Wait for login form
            await page.wait_for_selector('input[type="email"], input[name="email"]', timeout=10000)
            
            # Fill login credentials
            await page.fill('input[type="email"], input[name="email"]', email)
            await page.fill('input[type="password"], input[name="password"]', password)
            
            # Submit login
            await page.click('button[type="submit"], input[type="submit"]')
            
            # Wait for redirect to dashboard
            await page.wait_for_url("**/dashboard**", timeout=15000)
            
            print("✅ Successfully logged into hostingpalvelu.fi")
            return True
            
        except Exception as e:
            print(f"❌ Login failed: {e}")
            return False
    
    async def navigate_to_domain_management(self, page):
        """Navigate to domain management section"""
        print("🌐 Navigating to domain management...")
        
        try:
            # Look for domain management links
            domain_selectors = [
                '[href*="domain"]',
                'a:has-text("Domainit")',
                'a:has-text("Domains")',
                '[href*="dashboard"]'
            ]
            
            for selector in domain_selectors:
                try:
                    element = await page.query_selector(selector)
                    if element:
                        await element.click()
                        await page.wait_for_timeout(2000)
                        print(f"✅ Clicked domain management: {selector}")
                        break
                except:
                    continue
            
            return True
            
        except Exception as e:
            print(f"❌ Failed to navigate to domain management: {e}")
            return False
    
    async def find_fixuwatti_domain(self, page):
        """Find and select fixuwatti.fi domain"""
        print(f"🔍 Searching for {self.domain} domain...")
        
        try:
            # Look for the specific domain
            domain_selectors = [
                f'text={self.domain}',
                f'[href*="{self.domain}"]',
                'a:has-text("fixuwatti.fi")'
            ]
            
            for selector in domain_selectors:
                try:
                    element = await page.query_selector(selector)
                    if element:
                        await element.click()
                        await page.wait_for_timeout(3000)
                        print(f"✅ Found and selected {self.domain}")
                        return True
                except:
                    continue
            
            print(f"⚠️ {self.domain} not found in current view")
            return False
            
        except Exception as e:
            print(f"❌ Failed to find {self.domain}: {e}")
            return False
    
    async def access_dns_settings(self, page):
        """Access DNS settings for the domain"""
        print("⚙️ Accessing DNS settings...")
        
        try:
            # Look for DNS management links
            dns_selectors = [
                '[href*="dns"]',
                'a:has-text("DNS")',
                'a:has-text("DNS-asetukset")',
                'a:has-text("DNS Zone")',
                '[href*="zone"]'
            ]
            
            for selector in dns_selectors:
                try:
                    element = await page.query_selector(selector)
                    if element:
                        await element.click()
                        await page.wait_for_timeout(3000)
                        print(f"✅ Accessed DNS settings: {selector}")
                        return True
                except:
                    continue
            
            print("⚠️ DNS settings link not found, trying manual navigation...")
            
            # Try to access DNS zone editor directly
            await page.goto("https://hostingpalvelu.fi/dns-zone-editor")
            await page.wait_for_timeout(3000)
            
            return True
            
        except Exception as e:
            print(f"❌ Failed to access DNS settings: {e}")
            return False
    
    async def configure_mx_records(self, page):
        """Configure Zoho Mail MX records"""
        print("📧 Configuring MX records for Zoho Mail...")
        
        try:
            # Look for "Add MX Record" button or form
            add_mx_selectors = [
                'button:has-text("Add MX")',
                'a:has-text("Add MX")',
                'button:has-text("Lisää MX")',
                'input[value*="MX"]',
                '[href*="add-mx"]'
            ]
            
            # Add each MX record
            for i, mx_record in enumerate(self.zoho_mx_records):
                print(f"   Adding MX record {i+1}: {mx_record['value']}")
                
                # Try to find add button
                found_add_button = False
                for selector in add_mx_selectors:
                    try:
                        add_button = await page.query_selector(selector)
                        if add_button:
                            await add_button.click()
                            await page.wait_for_timeout(2000)
                            found_add_button = True
                            break
                    except:
                        continue
                
                if not found_add_button:
                    print(f"   ⚠️ Could not find Add MX button for record {i+1}")
                    continue
                
                # Fill MX record form
                await self.fill_mx_record_form(page, mx_record)
                
                # Submit the form
                await page.click('button[type="submit"], input[type="submit"]')
                await page.wait_for_timeout(2000)
            
            print("✅ MX records configuration completed")
            return True
            
        except Exception as e:
            print(f"❌ Failed to configure MX records: {e}")
            return False
    
    async def fill_mx_record_form(self, page, mx_record):
        """Fill individual MX record form"""
        try:
            # Common form field selectors
            host_selectors = ['input[name="host"]', 'input[name="name"]', 'input[placeholder*="host"]']
            priority_selectors = ['input[name="priority"]', 'input[name="pref"]', 'input[placeholder*="priority"]']
            value_selectors = ['input[name="value"]', 'input[name="dest"]', 'input[placeholder*="value"]']
            
            # Fill host field
            for selector in host_selectors:
                try:
                    await page.fill(selector, mx_record['host'])
                    print(f"     ✅ Set host: {mx_record['host']}")
                    break
                except:
                    continue
            
            # Fill priority field
            for selector in priority_selectors:
                try:
                    await page.fill(selector, mx_record['priority'])
                    print(f"     ✅ Set priority: {mx_record['priority']}")
                    break
                except:
                    continue
            
            # Fill value/destination field
            for selector in value_selectors:
                try:
                    await page.fill(selector, mx_record['value'])
                    print(f"     ✅ Set destination: {mx_record['value']}")
                    break
                except:
                    continue
            
        except Exception as e:
            print(f"❌ Failed to fill MX record form: {e}")
    
    async def update_spf_record(self, page):
        """Update SPF record for Zoho Mail"""
        print("📝 Updating SPF record...")
        
        try:
            # Look for TXT/SPF record section
            spf_selectors = [
                'button:has-text("Add TXT")',
                'a:has-text("Add TXT")',
                'input[name*="txt"]',
                'a:has-text("SPF")'
            ]
            
            for selector in spf_selectors:
                try:
                    element = await page.query_selector(selector)
                    if element:
                        await element.click()
                        await page.wait_for_timeout(2000)
                        break
                except:
                    continue
            
            # Fill SPF record
            spf_host_selectors = ['input[name="host"]', 'input[name="name"]']
            spf_value_selectors = ['input[name="value"]', 'input[name="txt"]']
            
            for selector in spf_host_selectors:
                try:
                    await page.fill(selector, "@")
                    print(f"     ✅ Set SPF host: @")
                    break
                except:
                    continue
            
            for selector in spf_value_selectors:
                try:
                    await page.fill(selector, self.spf_record)
                    print(f"     ✅ Set SPF value: {self.spf_record}")
                    break
                except:
                    continue
            
            # Submit SPF record
            await page.click('button[type="submit"], input[type="submit"]')
            await page.wait_for_timeout(2000)
            
            print("✅ SPF record updated")
            return True
            
        except Exception as e:
            print(f"❌ Failed to update SPF record: {e}")
            return False
    
    async def save_all_changes(self, page):
        """Save all DNS changes"""
        print("💾 Saving all DNS changes...")
        
        try:
            # Look for save/submit buttons
            save_selectors = [
                'button:has-text("Save")',
                'button:has-text("Tallenna")',
                'input[type="submit"][value*="Save"]',
                'button[type="submit"]'
            ]
            
            for selector in save_selectors:
                try:
                    element = await page.query_selector(selector)
                    if element:
                        await element.click()
                        await page.wait_for_timeout(3000)
                        print(f"✅ Saved changes: {selector}")
                        return True
                except:
                    continue
            
            print("⚠️ Save button not found, changes may be auto-saved")
            return True
            
        except Exception as e:
            print(f"❌ Failed to save changes: {e}")
            return False
    
    async def verify_configuration(self, page):
        """Verify DNS configuration"""
        print("🧪 Verifying DNS configuration...")
        
        try:
            # Check if we're back to DNS zone editor
            await page.goto("https://hostingpalvelu.fi/dns-zone-editor")
            await page.wait_for_timeout(3000)
            
            # Look for the configured records
            mx_found = 0
            spf_found = False
            
            # Check for MX records in the table
            for i in range(10):  # Check first 10 rows
                try:
                    row_text = await page.text_content(f'tr:nth-child({i+1})')
                    if 'mx.zoho.com' in row_text:
                        mx_found += 1
                        print(f"✅ Found MX record: {row_text.strip()}")
                    if 'mx2.zoho.com' in row_text:
                        mx_found += 1
                        print(f"✅ Found MX record: {row_text.strip()}")
                    if 'zoho.com' in row_text and 'spf' in row_text.lower():
                        spf_found = True
                        print(f"✅ Found SPF record: {row_text.strip()}")
                except:
                    continue
            
            print(f"📊 Configuration summary:")
            print(f"   MX Records found: {mx_found}/2")
            print(f"   SPF Record found: {spf_found}")
            
            if mx_found == 2 and spf_found:
                print("🎉 DNS configuration completed successfully!")
                return True
            else:
                print("⚠️ DNS configuration may need manual verification")
                return False
                
        except Exception as e:
            print(f"❌ Failed to verify configuration: {e}")
            return False
    
    async def run_automation(self, email, password):
        """Run the complete DNS automation"""
        print(f"🚀 Starting FixUatti.fi DNS automation...")
        print(f"Domain: {self.domain}")
        print(f"Target: Zoho Mail integration")
        print("")
        
        async with async_playwright() as p:
            # Launch browser
            browser = await p.chromium.launch(headless=False, slow_mo=1000)
            page = await browser.new_page()
            
            try:
                # Step 1: Login
                if not await self.login_to_hostingpalvelu(page, email, password):
                    return False
                
                # Step 2: Navigate to domain management
                if not await self.navigate_to_domain_management(page):
                    return False
                
                # Step 3: Find fixuwatti domain
                if not await self.find_fixuwatti_domain(page):
                    return False
                
                # Step 4: Access DNS settings
                if not await self.access_dns_settings(page):
                    return False
                
                # Step 5: Configure MX records
                if not await self.configure_mx_records(page):
                    return False
                
                # Step 6: Update SPF record
                if not await self.update_spf_record(page):
                    return False
                
                # Step 7: Save changes
                if not await self.save_all_changes(page):
                    return False
                
                # Step 8: Verify configuration
                verification_success = await self.verify_configuration(page)
                
                if verification_success:
                    print("\n🎉 SUCCESS! FixUatti.fi DNS setup completed!")
                    print("📧 Your domain is now configured for Zoho Mail")
                    print("⏰ DNS propagation will take 15-30 minutes")
                    print("🧪 Test with: dig MX fixuwatti.fi")
                else:
                    print("\n⚠️ DNS setup completed but needs verification")
                    print("📋 Please check hostingpalvelu.fi DNS settings manually")
                
            except Exception as e:
                print(f"❌ Automation failed: {e}")
                return False
            finally:
                await browser.close()
            
            return verification_success

async def main():
    """Main function to run DNS automation"""
    print("🎯 FixUatti.fi DNS Automation - Zoho Mail Setup")
    print("=" * 50)
    
    # Get credentials from user
    email = input("📧 Enter hostingpalvelu.fi email: ")
    password = input("🔑 Enter hostingpalvelu.fi password: ")
    
    print("\n🚀 Starting browser automation...")
    print("⚠️ Browser will open - please don't interact with it")
    print("🔄 This will configure DNS records automatically")
    
    # Run automation
    automation = FixUattiDNSAutomation()
    success = await automation.run_automation(email, password)
    
    if success:
        print("\n✅ Automation completed successfully!")
    else:
        print("\n❌ Automation failed - please check the logs above")

if __name__ == "__main__":
    asyncio.run(main())