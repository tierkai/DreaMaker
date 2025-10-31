#!/bin/bash

PROJECT_ID="mvbxxuoonqaomwqdwsmk"
ACCESS_TOKEN="sbp_oauth_03dace1baf0e314d3157a885680723c857d2c337"

# 获取当前secrets列表
echo "当前Secrets列表:"
curl -s -X GET "https://api.supabase.com/v1/projects/${PROJECT_ID}/secrets" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" | grep -i minimax || echo "未找到MINIMAX相关secrets"

echo ""
echo ""

# 尝试批量设置secrets
echo "批量设置Secrets..."
RESPONSE=$(curl -s -X POST "https://api.supabase.com/v1/projects/${PROJECT_ID}/secrets" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "[{\"name\":\"MINIMAX_API_KEY\",\"value\":\"${MINIMAX_API_KEY}\"},{\"name\":\"MINIMAX_GROUP_ID\",\"value\":\"${MINIMAX_GROUP_ID}\"}]")

echo "响应: $RESPONSE"
