#!/usr/bin/env python3
"""
Script to help extract Kilo Code API key from browser data
and configure it for the Converto Business OS project.
"""

import os
import json
import subprocess
import platform
from pathlib import Path

def find_browser_data():
    """Find browser data locations based on OS."""
    system = platform.system()
    
    if system == "Darwin":  # macOS
        browser_paths = [
            "~/Library/Application Support/Google/Chrome/Default/Preferences",
            "~/Library/Application Support/BraveSoftware/Brave-Browser/Default/Preferences",
            "~/Library/Safari/LocalStorage/https_kilocode.com_0.localstorage",
            "~/Library/Safari/Databases/https_kilocode.com_0.localstorage"
        ]
    elif system == "Windows":
        browser_paths = [
            "~/AppData/Local/Google/Chrome/User Data/Default/Preferences",
            "~/AppData/Local/BraveSoftware/Brave-Browser/User Data/Default/Preferences"
        ]
    else:  # Linux
        browser_paths = [
            "~/.config/google-chrome/Default/Preferences",
            "~/.config/brave/Default/Preferences"
        ]
    
    return [Path(p).expanduser() for p in browser_paths if Path(p).expanduser().exists()]

def search_api_key_in_files(file_paths):
    """Search for API key patterns in files."""
    api_patterns = [
        r'kilo.*code.*api.*key',
        r'api.*key.*kilo',
        r'sk-[a-zA-Z0-9]{32,}',
        r'kilo[a-zA-Z0-9]{20,}',
        r'KC_[a-zA-Z0-9]{32,}'
    ]
    
    import re
    found_keys = []
    
    for file_path in file_paths:
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
                for pattern in api_patterns:
                    matches = re.findall(pattern, content, re.IGNORECASE)
                    if matches:
                        found_keys.extend([(file_path, match) for match in matches])
        except Exception as e:
            print(f"Error reading {file_path}: {e}")
    
    return found_keys

def update_configuration(api_key):
    """Update project configuration with the found API key."""
    if not api_key:
        return False
    
    # Update .env file
    env_file = Path(".env")
    if env_file.exists():
        with open(env_file, 'r') as f:
            content = f.read()
        
        # Add or update Kilo Code API key
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
        
        print("✅ Updated .env file with Kilo Code API key")
    
    # Update cursor settings
    cursor_file = Path("cursor-settings.json")
    if cursor_file.exists():
        with open(cursor_file, 'r') as f:
            cursor_config = json.load(f)
        
        # Update image generation settings
        cursor_config['imageGeneration']['apiKey'] = api_key
        cursor_config['imageGeneration']['enabled'] = True
        
        with open(cursor_file, 'w') as f:
            json.dump(cursor_config, f, indent=2)
        
        print("✅ Updated cursor-settings.json with Kilo Code API key")
    
    return True

def main():
    print("🔍 Searching for Kilo Code API key in browser data...")
    
    # Find browser data files
    browser_files = find_browser_data()
    
    if not browser_files:
        print("❌ No browser data files found")
        print("📋 Manual steps:")
        print("1. Go to https://kilocode.com/dashboard")
        print("2. Login to your Teams account")
        print("3. Go to API settings or developer section")
        print("4. Copy your API key")
        print("5. Run this script again with the key: python3 scripts/extract_kilo_code_api_key.py YOUR_API_KEY")
        return
    
    # Search for API keys
    found_keys = search_api_key_in_files(browser_files)
    
    if found_keys:
        print("✅ Found potential API keys:")
        for file_path, key in found_keys:
            print(f"   📄 {file_path}: {key[:20]}...")
        
        # Use the first found key
        api_key = found_keys[0][1]
        
        if update_configuration(api_key):
            print(f"🎉 Successfully configured Kilo Code API key!")
            print(f"   Key: {api_key[:20]}...")
        else:
            print("❌ Failed to update configuration")
    else:
        print("❌ No API keys found in browser data")
        
        # Check if API key was provided as argument
        import sys
        if len(sys.argv) > 1:
            api_key = sys.argv[1]
            if update_configuration(api_key):
                print(f"🎉 Successfully configured Kilo Code API key from argument!")
                print(f"   Key: {api_key[:20]}...")
            else:
                print("❌ Failed to update configuration")
        else:
            print("📋 Manual configuration needed:")
            print("1. Get your API key from https://kilocode.com/dashboard")
            print("2. Run: python3 scripts/extract_kilo_code_api_key.py YOUR_API_KEY")

if __name__ == "__main__":
    main()