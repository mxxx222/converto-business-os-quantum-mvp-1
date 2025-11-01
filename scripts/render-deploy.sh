#!/bin/bash

# 🚀 Render Deployment Script
# Deploy Converto Business OS to Render

echo "🚀 Starting Render deployment..."

# Render API Key
RENDER_API_KEY="rnd_WWGcH1dYgaibub32Th7A1DPT4oDg"

# Service IDs
BACKEND_SERVICE_ID="srv-d3r10pjipnbc73asaod0"
FRONTEND_SERVICE_ID="srv-d41adhf5r7bs739aqe70"

# Function to trigger deployment
trigger_deployment() {
    local service_id=$1
    local service_name=$2

    echo "🔄 Triggering deployment for $service_name..."

    response=$(curl -s -X POST \
        -H "Authorization: Bearer $RENDER_API_KEY" \
        -H "Content-Type: application/json" \
        "https://api.render.com/v1/services/$service_id/deploys")

    if echo "$response" | grep -q '"id"'; then
        echo "✅ Deployment triggered for $service_name"
        deploy_id=$(echo "$response" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
        echo "📋 Deploy ID: $deploy_id"
    else
        echo "❌ Failed to trigger deployment for $service_name"
        echo "Response: $response"
    fi
}

# Function to check deployment status
check_deployment_status() {
    local service_id=$1
    local service_name=$2

    echo "🔍 Checking deployment status for $service_name..."

    response=$(curl -s -X GET \
        -H "Authorization: Bearer $RENDER_API_KEY" \
        "https://api.render.com/v1/services/$service_id")

    if echo "$response" | grep -q '"deployStatus"'; then
        status=$(echo "$response" | grep -o '"deployStatus":"[^"]*"' | head -1 | cut -d'"' -f4)
        echo "📊 $service_name status: $status"
    else
        echo "❌ Could not get status for $service_name"
    fi
}

# Function to get service logs
get_service_logs() {
    local service_id=$1
    local service_name=$2

    echo "📋 Getting logs for $service_name..."

    response=$(curl -s -X GET \
        -H "Authorization: Bearer $RENDER_API_KEY" \
        "https://api.render.com/v1/services/$service_id/logs")

    if echo "$response" | grep -q '"logs"'; then
        echo "✅ Logs retrieved for $service_name"
        echo "$response" | jq -r '.logs[]' | tail -10
    else
        echo "❌ Could not get logs for $service_name"
    fi
}

# Main deployment process
echo "🎯 Starting deployment process..."

# Check current status
check_deployment_status $BACKEND_SERVICE_ID "Backend"
check_deployment_status $FRONTEND_SERVICE_ID "Frontend"

# Trigger deployments
trigger_deployment $BACKEND_SERVICE_ID "Backend"
trigger_deployment $FRONTEND_SERVICE_ID "Frontend"

# Wait a moment
echo "⏳ Waiting for deployments to start..."
sleep 10

# Check status again
check_deployment_status $BACKEND_SERVICE_ID "Backend"
check_deployment_status $FRONTEND_SERVICE_ID "Frontend"

# Get logs if needed
echo ""
echo "📋 Recent logs:"
get_service_logs $BACKEND_SERVICE_ID "Backend"

echo ""
echo "🌐 Service URLs:"
echo "  Backend: https://converto-business-os-quantum-mvp-1.onrender.com"
echo "  Frontend: https://converto-marketing.onrender.com"

echo ""
echo "✅ Deployment process completed!"
echo "🔍 Check Render dashboard for detailed status: https://dashboard.render.com"
