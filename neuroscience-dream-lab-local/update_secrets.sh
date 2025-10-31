#!/bin/bash
set -e

PROJECT_ID="mvbxxuoonqaomwqdwsmk"
ACCESS_TOKEN="sbp_oauth_03dace1baf0e314d3157a885680723c857d2c337"

echo "正在设置Supabase Secrets..."

# 设置MINIMAX_API_KEY
curl -X POST "https://api.supabase.com/v1/projects/${PROJECT_ID}/secrets" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"MINIMAX_API_KEY\", \"value\": \"${MINIMAX_API_KEY}\"}" \
  -w "\nStatus: %{http_code}\n"

echo ""

# 设置MINIMAX_GROUP_ID
curl -X POST "https://api.supabase.com/v1/projects/${PROJECT_ID}/secrets" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"MINIMAX_GROUP_ID\", \"value\": \"${MINIMAX_GROUP_ID}\"}" \
  -w "\nStatus: %{http_code}\n"

echo ""
echo "Secrets配置完成，等待生效..."
sleep 3
