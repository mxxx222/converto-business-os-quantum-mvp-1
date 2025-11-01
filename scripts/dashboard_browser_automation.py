#!/usr/bin/env python3
"""
Browser automation script to access Kilo Code dashboard and retrieve API key.
Uses Playwright for browser automation.
"""

import asyncio
import os
import json
from playwright.async_api import async_playwright

class KiloCodeDashboard:
    def __init__(self):
        self.base_url = "https://kilocode.com"
        self.dashboard_url = "https://kilocode.com/dashboard"
        self.api_key = None
        
    async def get_api_key_from_dashboard(self, email, password):
        """Access Kilo Code dashboard and extract API key."""
        async with async_playwright() as p:
            # Launch browser
            browser = await p.chromium.launch(headless=False, slow_mo=1000)
            page = await browser.new_page()
            
            try:
                # Navigate to login page
                print("🌐 Navigating to Kilo Code...")
                await page.goto(self.base_url, wait_until="networkidle")
                
                # Look for login link or button
                login_selectors = [
                    "a[href*='login']",
                    "button:has-text('Login')", 
                    "a:has-text('Sign In')",
                    "button:has-text('Sign In')",
                    "a[href*='signin']",
                    "a:has-text('Dashboard')"
                ]
                
                login_found = False
                for selector in login_selectors:
                    try:
                        element = await page.query_selector(selector)
                        if element:
                            print(f"✅ Found login element: {selector}")
                            await element.click()
                            login_found = True
                            break
                    except:
                        continue
                
                if not login_found:
                    print("⚠️ Login button not found, checking if already on dashboard...")
                    # Check if we're already on dashboard
                    if "dashboard" in page.url:
                        print("✅ Already on dashboard")
                        await self.extract_api_key_from_page(page)
                        return self.api_key
                    else:
                        print("❌ Could not find login element")
                        return None
                
                # Fill login form
                print("📝 Filling login credentials...")
                await page.fill('input[type="email"], input[name="email"], input[id*="email"]', email)
                await page.fill('input[type="password"], input[name="password"], input[id*="password"]', password)
                
                # Submit form
                submit_selectors = [
                    'button[type="submit"]',
                    'input[type="submit"]',
                    'button:has-text("Login")',
                    'button:has-text("Sign In")',
                    'button:has-text("Continue")'
                ]
                
                for selector in submit_selectors:
                    try:
                        submit_btn = await page.query_selector(selector)
                        if submit_btn:
                            await submit_btn.click()
                            print("✅ Login form submitted")
                            break
                    except:
                        continue
                
                # Wait for dashboard to load
                await page.wait_for_url("**/dashboard**", timeout=10000)
                print("✅ Dashboard loaded successfully")
                
                # Extract API key from dashboard
                await self.extract_api_key_from_page(page)
                
            except Exception as e:
                print(f"❌ Error during automation: {e}")
                return None
            finally:
                await browser.close()
            
            return self.api_key
    
    async def extract_api_key_from_page(self, page):
        """Extract API key from the dashboard page."""
        try:
            print("🔍 Searching for API key on dashboard...")
            
            # Method 1: Look for API key in page source
            api_patterns = [
                r'sk-[a-zA-Z0-9]{32,}',
                r'kilo[a-zA-Z0-9]{20,}',
                r'KC_[a-zA-Z0-9]{32,}',
                r'api.*key.*[a-zA-Z0-9]{32,}',
                r'"api_key":"([a-zA-Z0-9]+)"',
                r"'api_key':'([a-zA-Z0-9]+)'"
            ]
            
            page_content = await page.content()
            import re
            
            for pattern in api_patterns:
                matches = re.findall(pattern, page_content, re.IGNORECASE)
                if matches:
                    for match in matches:
                        if len(str(match)) > 10:  # Filter out short matches
                            self.api_key = match if isinstance(match, str) else match[0]
                            print(f"✅ Found API key: {self.api_key[:20]}...")
                            return self.api_key
            
            # Method 2: Look for API section on page
            api_selectors = [
                '[href*="api"]',
                'button:has-text("API")',
                'a:has-text("API")',
                '[href*="key"]',
                'button:has-text("Key")',
                'a:has-text("Key")'
            ]
            
            for selector in api_selectors:
                try:
                    element = await page.query_selector(selector)
                    if element:
                        await element.click()
                        await page.wait_for_timeout(2000)
                        # Check content again
                        page_content = await page.content()
                        for pattern in api_patterns:
                            matches = re.findall(pattern, page_content, re.IGNORECASE)
                            if matches:
                                for match in matches:
                                    if len(str(match)) > 10:
                                        self.api_key = match if isinstance(match, str) else match[0]
                                        print(f"✅ Found API key: {self.api_key[:20]}...")
                                        return self.api_key
                except:
                    continue
            
            print("⚠️ API key not found on dashboard")
            return None
            
        except Exception as e:
            print(f"❌ Error extracting API key: {e}")
            return None

    async def update_project_config(self, api_key):
        """Update project configuration files with the API key."""
        try:
            # Update .env file
            env_file = ".env"
            if os.path.exists(env_file):
                with open(env_file, 'r') as f:
                    content = f.read()
                
                lines = content.split('\n')
                updated = False
                
                for i, line in enumerate(lines):
                    if line.startswith('KILO_CODE_API_KEY='):
                        lines[i] = f'KILO_CODE_API_KEY={api_key}'
                        updated = True
                        break
                
                if not updated:
                    lines.append(f'KILO_CODE_API_KEY={api_key}')
                
                with open(env_file, 'w') as f:
                    f.write('\n'.join(lines))
                
                print("✅ Updated .env file")
            
            # Update cursor-settings.json
            cursor_file = "cursor-settings.json"
            if os.path.exists(cursor_file):
                with open(cursor_file, 'r') as f:
                    cursor_config = json.load(f)
                
                cursor_config['imageGeneration']['apiKey'] = api_key
                cursor_config['imageGeneration']['enabled'] = True
                
                with open(cursor_file, 'w') as f:
                    json.dump(cursor_config, f, indent=2)
                
                print("✅ Updated cursor-settings.json")
            
            return True
        except Exception as e:
            print(f"❌ Error updating configuration: {e}")
            return False
    
    async def get_saved_credentials(self):
        """Try to get saved credentials from browser."""
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            context = await browser.new_context()
            
            # Look for saved login info
            try:
                # This would require checking browser's password manager
                # which is not accessible for security reasons
                pass
            except:
                pass
            
            await browser.close()
            return None

async def main():
    """Main function to get API key."""
    dashboard = KiloCodeDashboard()
    
    print("🎯 Kilo Code Dashboard Browser Automation")
    print("==========================================")
    print("This script will:")
    print("1. Open your browser")
    print("2. Navigate to Kilo Code dashboard") 
    print("3. Login with your credentials")
    print("4. Extract your API key")
    print("5. Configure the project automatically")
    print()
    
    # Get credentials
    email = input("📧 Enter your Kilo Code email: ")
    password = input("🔑 Enter your password: ")
    
    print("\n🚀 Starting browser automation...")
    api_key = await dashboard.get_api_key_from_dashboard(email, password)
    
    if api_key:
        print(f"\n🎉 Success! Found API key: {api_key[:20]}...")
        
        # Update configuration files
        await dashboard.update_project_config(api_key)
        
        print("\n✅ Configuration complete!")
        print("🚀 Your Kilo Code Teams API is now active!")
        
    else:
        print("\n❌ Could not find API key")
        print("💡 Manual steps:")
        print("1. Go to https://kilocode.com/dashboard")
        print("2. Navigate to API/Keys section")
        print("3. Copy your API key")
        print("4. Run: ./scripts/kilo_code_setup.sh")

if __name__ == "__main__":
    asyncio.run(main())