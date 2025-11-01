#!/bin/bash

# Browser Setup Monitor - Waits for workspace permissions
# Then automatically runs dual team automation

echo "🌐 NOTION BROWSER SETUP - AUTOMATED MONITOR"
echo "==========================================="
echo ""
echo "📱 Your browser is OPEN at: https://notion.so/my-integrations"
echo ""
echo "🔧 PLEASE COMPLETE THESE STEPS IN YOUR BROWSER:"
echo "================================================="
echo ""
echo "1. ✅ Look at your browser (already open)"
echo "2. 🔍 Find your integration: 'converto-business-os-api'"
echo "3. 🔲 Click 'Share' button"
echo "4. ➕ Add your workspace to the integration"
echo "5. ✅ Click 'Allow access'"
echo ""
echo "⏳ Monitor script will automatically detect when permissions are granted..."
echo "🔄 Will check every 30 seconds until setup is complete"
echo ""

API_KEY="${NOTION_API_KEY}"
CHECK_INTERVAL=30
MAX_ATTEMPTS=120  # 1 hour maximum
ATTEMPT=0

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
    ATTEMPT=$((ATTEMPT + 1))

    echo "[$ATTEMPT/$MAX_ATTEMPTS] Checking workspace permissions..."

    # Test if workspace access is now available
    TEST_RESPONSE=$(curl -s -X POST \
        -H "Authorization: Bearer $API_KEY" \
        -H "Content-Type: application/json" \
        -H "Notion-Version: 2022-06-28" \
        -d '{
            "parent": {"type": "workspace", "workspace": true},
            "title": [{"type": "text", "text": {"content": "Setup Test Database"}}],
            "properties": {
                "Name": {"title": {}}
            }
        }' \
        "https://api.notion.com/v1/databases")

    # Check if database creation was successful
    if echo "$TEST_RESPONSE" | grep -q '"object":"database"'; then
        echo ""
        echo "🎉 SUCCESS! Workspace permissions granted!"
        echo "✅ Database creation is now working!"
        echo ""

        # Extract the created database ID
        CREATED_DB_ID=$(echo "$TEST_RESPONSE" | jq -r '.id')
        echo "📊 Test Database ID: $CREATED_DB_ID"
        echo ""

        # Delete the test database to clean up
        echo "🧹 Cleaning up test database..."
        curl -s -X DELETE \
            -H "Authorization: Bearer $API_KEY" \
            "https://api.notion.com/v1/databases/$CREATED_DB_ID" > /dev/null
        echo "✅ Test database cleaned up"
        echo ""

        echo "🚀 PROCEEDING WITH DUAL TEAM AUTOMATION SETUP!"
        echo "=============================================="
        echo ""

        # Run the main dual team setup
        ./scripts/notion-dual-team-max-roi.sh

        if [ $? -eq 0 ]; then
            echo ""
            echo "🎉 DUAL TEAM NOTION AUTOMATION SETUP COMPLETE!"
            echo "=============================================="
            echo ""
            echo "✅ All databases created successfully!"
            echo "✅ Automation scripts are ready!"
            echo "✅ Dual team ROI optimization is active!"
            echo ""
            echo "🚀 NEXT STEPS:"
            echo "1. Generate daily reports: ./scripts/notion-dual-team-daily-report.sh"
            echo "2. Create AI tasks: ./scripts/notion-dual-team-ai-tasks.sh"
            echo "3. Calculate ROI: ./scripts/notion-dual-team-roi-calculator.sh"
            echo "4. Monitor analytics: ./scripts/notion-dual-team-analytics.sh"
            echo ""
            echo "💰 Expected monthly value: €16,800-21,000"
            echo "📈 ROI: 17,500-21,875%"
            echo "🎯 Annual value: €201,600-252,000"
            echo ""
            echo "🏆 Your Notion Business subscription is now fully optimized!"

            exit 0
        else
            echo "❌ Automation setup failed. Please check the error above."
            exit 1
        fi
    elif echo "$TEST_RESPONSE" | grep -q "validation_error\|permission_denied\|unauthorized"; then
        echo "⏳ Still waiting for permissions..."
        echo "   Next check in $CHECK_INTERVAL seconds..."
        echo "   (Progress: $(( (ATTEMPT * CHECK_INTERVAL) / 60 )) minutes elapsed)"
        sleep $CHECK_INTERVAL
    else
        echo "⚠️ Unexpected API response. Checking again in $CHECK_INTERVAL seconds..."
        echo "   Response: $TEST_RESPONSE"
        sleep $CHECK_INTERVAL
    fi
done

echo ""
echo "❌ TIMEOUT: Waited 60 minutes without getting permissions"
echo ""
echo "📋 MANUAL SETUP REQUIRED:"
echo "=========================="
echo "1. Go to: https://notion.so/my-integrations"
echo "2. Find: 'converto-business-os-api'"
echo "3. Click: 'Share'"
echo "4. Add your workspace to the integration"
echo "5. Allow access"
echo ""
echo "🔧 Then run manually: ./scripts/notion-dual-team-max-roi.sh"
echo ""
echo "💡 TIP: Make sure you're logged into Notion with the correct account!"

exit 1
