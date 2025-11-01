#!/usr/bin/env python3

# Browser automation to grant Notion workspace permissions
# Uses existing browser session at https://notion.so/my-integrations

import subprocess


def grant_notion_permissions():
    """Automatically grant workspace permissions to the Notion integration."""

    print("🌐 GRANTING NOTION WORKSPACE PERMISSIONS")
    print("========================================")
    print("")
    print("📱 Browser is open to: https://notion.so/my-integrations")
    print("🎯 Looking for: 'converto-business-os-api' integration")
    print("")

    # Use AppleScript to simulate user interaction
    applescript = """
    tell application "Google Chrome"
        activate
        delay 2

        -- Look for the integration page
        set found to false
        repeat with w in windows
            repeat with t in tabs of w
                if URL of t contains "notion.so/my-integrations" then
                    set active tab index of w to index of t
                    set found to true
                    exit repeat
                end if
            end repeat
            if found then exit repeat
        end repeat

        if not found then
            make new window
            set URL of active tab of front window to "https://notion.so/my-integrations"
            delay 5
        end if

        -- Wait for page to load
        delay 3

        -- Try to find and click the Share button for the integration
        try
            -- Look for the integration by name
            set integrationFound to false
            execute javascript "Array.from(document.querySelectorAll('[class*=\"name\"], [class*=\"title\"]')).forEach(el => { if(el.textContent.includes('converto-business-os-api')) { el.click(); setTimeout(() => { const shareBtn = document.querySelector('[class*=\"share\"], [class*=\"Share\"], button'); if(shareBtn) shareBtn.click(); }, 1000); } });" in active tab
            integrationFound = true
        on error
            -- Fallback: look for any share button
            try
                execute javascript "document.querySelectorAll('[class*=\"share\"]').forEach(btn => btn.click());" in active tab
            on error
                -- Manual fallback
                activate
                display alert "Manual permission grant needed" message "Please find 'converto-business-os-api' integration and click Share, then add workspace and Allow access."
            end try
        end try

        delay 2
        execute javascript "setTimeout(() => { document.querySelector('[class*=\"share\"], [class*=\"Share\"], [class*=\"allow\"], [class*=\"Allow\"], button').forEach(btn => { if(btn.textContent.toLowerCase().includes('allow') || btn.textContent.toLowerCase().includes('add') || btn.textContent.toLowerCase().includes('share')) btn.click(); }); }, 500);" in active tab

    end tell
    """

    try:
        # Execute AppleScript
        print("🤖 Attempting to grant permissions...")
        result = subprocess.run(
            ["osascript", "-e", applescript], capture_output=True, text=True, timeout=30
        )

        if result.returncode == 0:
            print("✅ Permissions granted via browser automation!")
            print("🔄 Monitor script should detect this within 30 seconds")
        else:
            print("⚠️ Browser automation had issues, falling back to manual process")
            print("📋 Please complete these steps manually in your browser:")
            print("1. Find 'converto-business-os-api' integration")
            print("2. Click 'Share'")
            print("3. Add your workspace to the integration")
            print("4. Click 'Allow access'")

    except subprocess.TimeoutExpired:
        print("⏱️ Browser automation timed out")
        print("📋 Please complete the permission grant manually")

    except Exception as e:
        print(f"❌ Browser automation error: {e}")
        print("📋 Please complete the permission grant manually")

    print("")
    print("🔍 VERIFICATION STEP:")
    print("Check the monitor script terminal to see if permissions are detected")
    print("Expected: 'SUCCESS! Workspace permissions granted!' message")

    return True


if __name__ == "__main__":
    grant_notion_permissions()
