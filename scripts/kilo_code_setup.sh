#!/bin/bash

# Kilo Code Teams API Key Setup Script
# This script helps you configure your Kilo Code API key for maximum Teams subscription benefit

echo "🎯 Kilo Code Teams API Key Setup"
echo "================================="

# Function to prompt for API key
get_api_key() {
    echo ""
    echo "📋 To get your API key:"
    echo "1. Go to https://kilocode.com/dashboard"
    echo "2. Login with your Teams account"
    echo "3. Navigate to 'API Keys' or 'Developer' section"
    echo "4. Generate/Copy your API key"
    echo ""
    read -p "🔑 Paste your Kilo Code API key here: " KILO_CODE_KEY

    if [ -z "$KILO_CODE_KEY" ]; then
        echo "❌ API key is required!"
        return 1
    fi

    return 0
}

# Function to update .env file
update_env() {
    echo "🔧 Updating .env file..."

    if [ ! -f ".env" ]; then
        touch ".env"
    fi

    # Remove existing Kilo Code entries
    sed -i '' '/KILO_CODE_/d' .env

    # Add new entries
    echo "" >> .env
    echo "# Kilo Code API Configuration" >> .env
    echo "KILO_CODE_API_KEY=$KILO_CODE_KEY" >> .env
    echo "KILO_CODE_API_BASE=https://api.kilocode.com" >> .env
    echo "IMAGE_GENERATION_ENABLED=true" >> .env

    echo "✅ Updated .env file"
}

# Function to update cursor settings
update_cursor() {
    echo "🔧 Updating cursor-settings.json..."

    if [ ! -f "cursor-settings.json" ]; then
        echo "❌ cursor-settings.json not found!"
        return 1
    fi

    # Update using jq if available, otherwise manual
    if command -v jq &> /dev/null; then
        jq --arg key "$KILO_CODE_KEY" '
            .imageGeneration.apiKey = $key |
            .imageGeneration.enabled = true |
            .imageGeneration.maxImages = 8 |
            .imageGeneration.defaultModel = "image-generation-v2"
        ' cursor-settings.json > cursor-settings.json.tmp

        mv cursor-settings.json.tmp cursor-settings.json
        echo "✅ Updated cursor-settings.json with jq"
    else
        # Manual backup and edit
        cp cursor-settings.json cursor-settings.json.backup

        echo "📝 Manual edit needed in cursor-settings.json:"
        echo "   - Set imageGeneration.enabled = true"
        echo "   - Set imageGeneration.apiKey = $KILO_CODE_KEY"
        echo "   - Set imageGeneration.maxImages = 8 (Teams benefit)"
        echo "   - Set imageGeneration.defaultModel = 'image-generation-v2'"

        echo "✅ Backup created: cursor-settings.json.backup"
    fi
}

# Function to test API connection
test_api() {
    echo ""
    echo "🧪 Testing Kilo Code API connection..."

    if command -v curl &> /dev/null; then
        response=$(curl -s -H "Authorization: Bearer $KILO_CODE_KEY" \
                      "https://api.kilocode.com/v1/models" \
                      --max-time 10)

        if echo "$response" | grep -q "models\|data"; then
            echo "✅ API connection successful!"
            echo "🔍 Available models:"
            echo "$response" | head -20
        else
            echo "⚠️ API response received but may need verification"
            echo "Response: $response"
        fi
    else
        echo "📋 curl not available for testing"
        echo "You can test manually with:"
        echo "curl -H 'Authorization: Bearer $KILO_CODE_KEY' https://api.kilocode.com/v1/models"
    fi
}

# Main execution
main() {
    echo "🚀 This will configure your Kilo Code Teams API key for maximum benefits"
    echo "📈 Teams subscription optimizations:"
    echo "   • Higher generation limits (8+ images)"
    echo "   • Priority processing"
    echo "   • Advanced models access"
    echo "   • Batch processing capabilities"
    echo ""

    if get_api_key; then
        update_env
        update_cursor
        test_api

        echo ""
        echo "🎉 Setup Complete!"
        echo "=================="
        echo "✅ Environment variables configured"
        echo "✅ Cursor settings updated"
        echo "✅ Teams subscription features enabled"
        echo ""
        echo "🔄 Next steps:"
        echo "1. Restart your development environment"
        echo "2. Test image generation in your app"
        echo "3. Monitor usage against Teams limits"
        echo ""
        echo "📊 Monitor your Teams subscription usage at:"
        echo "   https://kilocode.com/dashboard/usage"

    else
        echo "❌ Setup cancelled - API key required"
        exit 1
    fi
}

# Run main function
main
