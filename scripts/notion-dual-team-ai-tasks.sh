#!/bin/bash
# Dual Team AI-Powered Task Generator
API_KEY="${NOTION_API_KEY}"
TASKS_DB="${NOTION_CROSS_TEAM_TASKS_DB}"

echo "🤖 Generating dual team AI business optimization tasks..."

# High-ROI dual team tasks
declare -a DUAL_TASKS=(
    '{"title": "Cross-Team API Integration", "team": "Cross-Team", "priority": "Critical", "roi": "Critical", "value": 5000, "synergy": true}'
    '{"title": "Converto Business OS Scaling", "team": "Converto", "priority": "High", "roi": "High", "value": 3000, "synergy": false}'
    '{"title": "Viking Labs DevOps Automation", "team": "Viking Labs", "priority": "High", "roi": "High", "value": 2800, "synergy": false}'
    '{"title": "Dual Team Customer Portal", "team": "Cross-Team", "priority": "High", "roi": "Critical", "value": 4500, "synergy": true}'
    '{"title": "Converto ROI Optimization", "team": "Converto", "priority": "Medium", "roi": "High", "value": 2000, "synergy": false}'
    '{"title": "Viking Labs Code Quality", "team": "Viking Labs", "priority": "Medium", "roi": "Medium", "value": 1800, "synergy": false}'
    '{"title": "Team Synergy Analytics", "team": "Cross-Team", "priority": "High", "roi": "Critical", "value": 3800, "synergy": true}'
)

# Add AI-generated tasks
for i in {1..7}; do
    TASK=${DUAL_TASKS[$RANDOM % ${#DUAL_TASKS[@]}]}
    
    TASK_TITLE=$(echo "$TASK" | jq -r '.title')
    TASK_TEAM=$(echo "$TASK" | jq -r '.team')
    TASK_PRIORITY=$(echo "$TASK" | jq -r '.priority')
    TASK_ROI=$(echo "$TASK" | jq -r '.roi')
    TASK_VALUE=$(echo "$TASK" | jq -r '.value')
    TASK_SYNERGY=$(echo "$TASK" | jq -r '.synergy')
    
    curl -s -X POST \
      -H "Authorization: Bearer $API_KEY" \
      -H "Content-Type: application/json" \
      -H "Notion-Version: 2022-06-28" \
      -d "{
        \"parent\": {\"database_id\": \"$TASKS_DB\"},
        \"properties\": {
          \"Task Name\": {\"title\": [{\"text\": {\"content\": \"$TASK_TITLE\"}}]},
          \"Team\": {\"select\": {\"name\": \"$TASK_TEAM\"}},
          \"Status\": {\"select\": {\"name\": \"Not Started\"}},
          \"Priority\": {\"select\": {\"name\": \"$TASK_PRIORITY\"}},
          \"ROI Impact\": {\"select\": {\"name\": \"$TASK_ROI\"}},
          \"AI Generated\": {\"checkbox\": true},
          \"Business Value\": {\"number\": $TASK_VALUE},
          \"Team Synergy\": {\"checkbox\": $TASK_SYNERGY}
        }
      }" \
      "https://api.notion.com/v1/pages" > /dev/null
    
    SYNERGY_FLAG=$(if [ "$TASK_SYNERGY" = "true" ]; then echo "🔗"; else echo "⚡"; fi)
    echo "$SYNERGY_FLAG Task: $TASK_TITLE (€$TASK_VALUE value) - $TASK_TEAM"
done

echo "🎯 Dual team AI task generation complete! Ready for maximum ROI!"
