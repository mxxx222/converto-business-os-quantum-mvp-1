#!/usr/bin/env python3
"""
Simple Kilo Code API key extractor using curl and browser automation
"""

import subprocess
import os
import json
import time
import shutil

def extract_from_browser():
    """Try to extract API key using browser automation."""
    
    print("🔍 Attempting to extract Kilo Code API key...")
    
    # Method 1: Try to use browser's developer tools to extract API key
    # Since browser is already open, we can try to access it
    
    # Method 2: Try using applescript to interact with browser
    try:
        # Get the current URL from Safari (if it's the default browser)
        url_script = '''
        tell application "Safari"
            if it is running then
                return URL of front window as string
            end if
        end tell
        '''
        
        result = subprocess.run(['osascript', '-e', url_script], 
                              capture_output=True, text=True, timeout=5)
        
        if result.returncode == 0:
            current_url = result.stdout.strip()
            print(f"📱 Current browser URL: {current_url}")
            
            if "kilocode" in current_url.lower():
                print("✅ Browser is on Kilo Code site!")
                
                # Try to get page source
                page_source_script = '''
                tell application "Safari"
                    if it is running then
                        return source of front window as string
                    end if
                end tell
                '''
                
                source_result = subprocess.run(['osascript', '-e', page_source_script],
                                             capture_output=True, text=True, timeout=10)
                
                if source_result.returncode == 0:
                    page_source = source_result.stdout
                    print("📄 Retrieved page source, searching for API key...")
                    
                    # Search for API key patterns in the source
                    import re
                    api_patterns = [
                        r'sk-[a-zA-Z0-9]{32,}',
                        r'kilo[a-zA-Z0-9]{20,}',
                        r'KC_[a-zA-Z0-9]{32,}',
                        r'api_key["\s]*:["\s]*"([a-zA-Z0-9]+)"',
                        r'"apiKey"["\s]*:["\s]*"([a-zA-Z0-9]+)"',
                        r'const\s+apiKey\s*=\s*["\']([a-zA-Z0-9]+)["\']',
                        r'window\.apiKey\s*=\s*["\']([a-zA-Z0-9]+)["\']',
                        r'document\.querySelector[^>]*value=["\']([a-zA-Z0-9]{32,})["\']'
                    ]
                    
                    for pattern in api_patterns:
                        matches = re.findall(pattern, page_source, re.IGNORECASE)
                        if matches:
                            for match in matches:
                                api_key = match if isinstance(match, str) else match[0]
                                if len(str(api_key)) >= 20:  # Filter reasonable length
                                    print(f"🎉 FOUND API KEY: {api_key}")
                                    return api_key
                
    except Exception as e:
        print(f"⚠️ AppleScript method failed: {e}")
    
    # Method 3: Try to access browser's local storage via file system
    try:
        print("🔍 Checking browser local storage files...")
        
        # Check common browser storage locations
        storage_locations = [
            "~/Library/Safari/LocalStorage/https_kilocode.com_0.localstorage",
            "~/Library/Safari/Databases/https_kilocode.com_0.localstorage",
            "~/Library/Application Support/Google/Chrome/Default/Local Storage/leveldb",
            "~/Library/Application Support/Firefox/Profiles/*/storage/default/https+++kilocode.com*/ls/data.sqlite"
        ]
        
        for location in storage_locations:
            expanded_location = os.path.expanduser(location)
            
            # Use find to locate the files
            if '*' in expanded_location:
                # Handle wildcard paths
                import glob
                files = glob.glob(expanded_location)
                for file_path in files:
                    if os.path.exists(file_path):
                        print(f"📁 Found storage file: {file_path}")
                        # Try to extract strings from the file
                        try:
                            with open(file_path, 'rb') as f:
                                content = f.read()
                                content_str = content.decode('utf-8', errors='ignore')
                                
                                # Search for API key patterns
                                import re
                                api_patterns = [
                                    r'sk-[a-zA-Z0-9]{32,}',
                                    r'kilo[a-zA-Z0-9]{20,}',
                                    r'KC_[a-zA-Z0-9]{32,}',
                                ]
                                
                                for pattern in api_patterns:
                                    matches = re.findall(pattern, content_str, re.IGNORECASE)
                                    if matches:
                                        api_key = matches[0]
                                        print(f"🎉 FOUND API KEY in storage: {api_key}")
                                        return api_key
                        except Exception as e:
                            print(f"❌ Error reading {file_path}: {e}")
            else:
                if os.path.exists(expanded_location):
                    print(f"📁 Found storage location: {expanded_location}")
                    
    except Exception as e:
        print(f"⚠️ Storage file method failed: {e}")
    
    # Method 4: Try to use the browser's profile to extract credentials
    try:
        print("🔍 Checking browser profile credentials...")
        
        # Check Firefox logins or cookies
        ff_profile_dir = "~/Library/Application Support/Firefox/Profiles/l19std0t.default-release-1"
        expanded_ff_dir = os.path.expanduser(ff_profile_dir)
        
        if os.path.exists(expanded_ff_dir):
            # Check cookies.sqlite
            cookies_file = os.path.join(expanded_ff_dir, "cookies.sqlite")
            if os.path.exists(cookies_file):
                print("📊 Found Firefox cookies, checking for Kilo Code data...")
                
                # Use strings command to extract readable content
                try:
                    result = subprocess.run(['strings', cookies_file], 
                                          capture_output=True, text=True, timeout=10)
                    if result.returncode == 0:
                        content = result.stdout
                        
                        # Search for Kilo Code related data
                        if 'kilocode' in content.lower():
                            print("🍪 Found Kilo Code cookies data")
                            
                            # Look for API keys or tokens
                            import re
                            api_patterns = [
                                r'sk-[a-zA-Z0-9]{32,}',
                                r'kilo[a-zA-Z0-9]{20,}',
                                r'KC_[a-zA-Z0-9]{32,}',
                                r'api.*[a-zA-Z0-9]{32,}',
                                r'token.*[a-zA-Z0-9]{20,}'
                            ]
                            
                            for pattern in api_patterns:
                                matches = re.findall(pattern, content, re.IGNORECASE)
                                if matches:
                                    for match in matches:
                                        if len(str(match)) >= 20:
                                            api_key = match
                                            print(f"🎉 FOUND API KEY in cookies: {api_key}")
                                            return api_key
                
                except Exception as e:
                    print(f"❌ Error processing cookies: {e}")
    
    except Exception as e:
        print(f"⚠️ Profile method failed: {e}")
    
    print("❌ Could not extract API key automatically")
    return None

def update_project_with_key(api_key):
    """Update project configuration with the found API key."""
    if not api_key:
        return False
    
    try:
        print(f"🔧 Updating project with API key: {api_key[:20]}...")
        
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
                lines.append('IMAGE_GENERATION_ENABLED=true')
            
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

def test_api_connection(api_key):
    """Test the API connection with the found key."""
    if not api_key:
        return False
    
    try:
        print("🧪 Testing API connection...")
        
        # Test with Kilo Code API
        import requests
        
        headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }
        
        response = requests.get('https://api.kilocode.com/v1/models', headers=headers, timeout=10)
        
        if response.status_code == 200:
            print("✅ API connection successful!")
            return True
        else:
            print(f"⚠️ API response: {response.status_code} - {response.text[:100]}")
            return False
    
    except Exception as e:
        print(f"⚠️ API test failed: {e}")
        return False

def main():
    print("🎯 Kilo Code API Key Extraction")
    print("=" * 40)
    
    # Extract API key
    api_key = extract_from_browser()
    
    if api_key:
        print(f"\n🎉 SUCCESS! Found API key: {api_key[:20]}...")
        
        # Update project configuration
        if update_project_with_key(api_key):
            print("✅ Configuration updated")
            
            # Test API connection
            if test_api_connection(api_key):
                print("🚀 API connection tested successfully!")
                print("\n🎯 Your Kilo Code Teams integration is now active!")
            else:
                print("⚠️ API connection test failed - key may need verification")
        else:
            print("❌ Failed to update configuration")
    else:
        print("\n❌ Could not extract API key automatically")
        print("\n📋 Manual steps needed:")
        print("1. Go to your open Kilo Code dashboard")
        print("2. Look for API Keys or Developer section")
        print("3. Copy your Teams API key")
        print("4. Run: ./scripts/kilo_code_setup.sh")

if __name__ == "__main__":
    main()