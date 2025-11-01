#!/bin/bash

# 🚀 Lighthouse Performance Test Script
# Tests mobile performance for Premium page

echo "🔍 Starting Lighthouse performance test..."

# Check if lighthouse is installed
if ! command -v lighthouse &> /dev/null; then
    echo "❌ Lighthouse not found. Installing..."
    npm install -g lighthouse
fi

# Check if frontend is running
if ! curl -s http://localhost:3000/premium > /dev/null; then
    echo "❌ Frontend not running. Starting development server..."
    cd frontend
    npm run dev &
    DEV_PID=$!

    # Wait for server to start
    echo "⏳ Waiting for server to start..."
    sleep 10

    # Check if server is ready
    for i in {1..30}; do
        if curl -s http://localhost:3000/premium > /dev/null; then
            echo "✅ Server is ready!"
            break
        fi
        echo "⏳ Waiting... ($i/30)"
        sleep 2
    done
fi

# Run Lighthouse test
echo "🧪 Running Lighthouse test on mobile..."

lighthouse http://localhost:3000/premium \
  --only-categories=performance,accessibility,best-practices,seo \
  --form-factor=mobile \
  --throttling-method=devtools \
  --throttling.cpuSlowdownMultiplier=4 \
  --throttling.rttMs=150 \
  --throttling.throughputKbps=1638.4 \
  --output=html \
  --output-path=./lighthouse-report.html \
  --chrome-flags="--headless --no-sandbox --disable-gpu"

# Check results
if [ $? -eq 0 ]; then
    echo "✅ Lighthouse test completed successfully!"
    echo "📊 Report saved to: ./lighthouse-report.html"

    # Extract key metrics
    echo "📈 Key Metrics:"
    echo "- Performance Score: $(grep -o '"score": [0-9]*' lighthouse-report.html | head -1 | grep -o '[0-9]*')"
    echo "- Accessibility Score: $(grep -o '"score": [0-9]*' lighthouse-report.html | sed -n '2p' | grep -o '[0-9]*')"
    echo "- Best Practices Score: $(grep -o '"score": [0-9]*' lighthouse-report.html | sed -n '3p' | grep -o '[0-9]*')"
    echo "- SEO Score: $(grep -o '"score": [0-9]*' lighthouse-report.html | sed -n '4p' | grep -o '[0-9]*')"

    # Check if performance score is above 90
    PERFORMANCE_SCORE=$(grep -o '"score": [0-9]*' lighthouse-report.html | head -1 | grep -o '[0-9]*')
    if [ "$PERFORMANCE_SCORE" -ge 90 ]; then
        echo "🎉 Performance score is $PERFORMANCE_SCORE - EXCELLENT!"
    elif [ "$PERFORMANCE_SCORE" -ge 80 ]; then
        echo "✅ Performance score is $PERFORMANCE_SCORE - GOOD"
    else
        echo "⚠️ Performance score is $PERFORMANCE_SCORE - NEEDS IMPROVEMENT"
    fi
else
    echo "❌ Lighthouse test failed!"
    exit 1
fi

# Cleanup
if [ ! -z "$DEV_PID" ]; then
    echo "🧹 Cleaning up development server..."
    kill $DEV_PID
fi

echo "🏁 Lighthouse test completed!"
