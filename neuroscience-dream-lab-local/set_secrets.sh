#!/bin/bash
set -e

# 从环境变量获取值
MINIMAX_API_KEY="${MINIMAX_API_KEY}"
MINIMAX_GROUP_ID="${MINIMAX_GROUP_ID}"

# 设置Supabase项目引用
PROJECT_ID="mvbxxuoonqaomwqdwsmk"
ACCESS_TOKEN="sbp_oauth_03dace1baf0e314d3157a885680723c857d2c337"

echo "设置Supabase Secrets..."

# 使用Supabase Management API设置secrets
curl -X POST "https://api.supabase.com/v1/projects/${PROJECT_ID}/secrets" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "[
    {\"name\": \"MINIMAX_API_KEY\", \"value\": \"${MINIMAX_API_KEY}\"},
    {\"name\": \"MINIMAX_GROUP_ID\", \"value\": \"${MINIMAX_GROUP_ID}\"}
  ]"

echo ""
echo "Secrets设置完成"
