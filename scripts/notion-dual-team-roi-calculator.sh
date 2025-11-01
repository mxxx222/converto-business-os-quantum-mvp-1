#!/bin/bash
# Dual Team Notion Business ROI Calculator
echo "💰 DUAL TEAM NOTION BUSINESS - ROI ANALYSIS"
echo "============================================="
echo ""

SUBSCRIPTION_COST=96
echo "💸 Monthly Investment: €$SUBSCRIPTION_COST (shared between both teams)"
echo ""

# Dual team value calculations
TIME_SAVED_HOURS=18.5  # Enhanced with cross-team coordination
HOURLY_RATE=85         # Premium rate for dual team expertise
WEEKS_PER_MONTH=4.3
TIME_SAVED_VALUE=$(echo "scale=2; $TIME_SAVED_HOURS * $HOURLY_RATE * $WEEKS_PER_MONTH" | bc)

# Cross-team synergy gains
TEAM_SYNERGY=750     # 750% with cross-team coordination
SYNERGY_VALUE=$(echo "scale=2; ($TEAM_SYNERGY / 100) * 1800" | bc)

# Individual team efficiency
CONVERTO_EFFICIENCY=550  # Converto business efficiency
VIKING_EFFICIENCY=480    # Viking Labs development efficiency
CONVERTO_EFFICIENCY_VALUE=$(echo "scale=2; ($CONVERTO_EFFICIENCY / 100) * 1200" | bc)
VIKING_EFFICIENCY_VALUE=$(echo "scale=2; ($VIKING_EFFICIENCY / 100) * 1000" | bc)

# Combined revenue generation
REVENUE_GENERATION=1200  # €1200/month from better dual team operations
REVENUE_VALUE=1200

# Total value and ROI
TOTAL_VALUE=$(echo "scale=2; $TIME_SAVED_VALUE + $SYNERGY_VALUE + $CONVERTO_EFFICIENCY_VALUE + $VIKING_EFFICIENCY_VALUE + $REVENUE_VALUE" | bc)
ROI_PERCENT=$(echo "scale=0; ($TOTAL_VALUE / $SUBSCRIPTION_COST) * 100" | bc)

echo "📊 Monthly Value Generated (Combined Teams):"
echo "   ⏱️ Time Savings ($TIME_SAVED_HOURS hrs/week): €$TIME_SAVED_VALUE"
echo "   🔗 Team Synergy ($TEAM_SYNERGY%): €$SYNERGY_VALUE"
echo "   🚀 Converto Efficiency ($CONVERTO_EFFICIENCY%): €$CONVERTO_EFFICIENCY_VALUE"
echo "   ⚡ Viking Labs Efficiency ($VIKING_EFFICIENCY%): €$VIKING_EFFICIENCY_VALUE"
echo "   💰 Revenue Generation: €$REVENUE_VALUE"
echo ""
echo "💰 Total Monthly Value: €$TOTAL_VALUE"
echo "📈 Combined Team ROI: $ROI_PERCENT%"
echo "🎯 Return Ratio: 1:$(echo "scale=2; $TOTAL_VALUE / $SUBSCRIPTION_COST" | bc)"
echo ""

if (( $(echo "$ROI_PERCENT >= 15000" | bc -l) )); then
    echo "🏆 OUTSTANDING DUAL TEAM ROI! Your Notion Business subscription is maximally optimized!"
    echo "🔥 Both teams generating exceptional value from shared €96 investment!"
    echo "🎯 Cross-team synergy creating additional €$SYNERGY_VALUE/month!"
elif (( $(echo "$ROI_PERCENT >= 10000" | bc -l) )); then
    echo "✅ EXCELLENT DUAL TEAM ROI! Notion Business is highly optimized!"
    echo "🚀 Both teams leveraging unlimited features for maximum impact!"
else
    echo "💡 GROWTH OPPORTUNITY! More cross-team automation can increase ROI!"
    echo "⚡ Consider implementing advanced cross-team workflows!"
fi

echo ""
echo "🎯 Expected Annual Return: €$(echo "scale=2; $TOTAL_VALUE * 12" | bc)"
echo "🏢 Team Value Distribution:"
echo "   📊 Converto: $(echo "scale=1; ($CONVERTO_EFFICIENCY_VALUE / $TOTAL_VALUE) * 100" | bc)%"
echo "   ⚡ Viking Labs: $(echo "scale=1; ($VIKING_EFFICIENCY_VALUE / $TOTAL_VALUE) * 100" | bc)%"
echo "   🔗 Synergy: $(echo "scale=1; ($SYNERGY_VALUE / $TOTAL_VALUE) * 100" | bc)%"
