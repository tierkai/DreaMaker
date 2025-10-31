#!/bin/bash
set -e

PROJECT_ID="mvbxxuoonqaomwqdwsmk"
ACCESS_TOKEN="sbp_oauth_03dace1baf0e314d3157a885680723c857d2c337"

echo "=== 步骤1: 检查当前Secrets ==="
CURRENT_SECRETS=$(curl -s -X GET "https://api.supabase.com/v1/projects/${PROJECT_ID}/secrets" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}")
echo "$CURRENT_SECRETS" | python3 -m json.tool 2>&1 | head -40

echo ""
echo "=== 步骤2: 设置MiniMax Secrets ==="

# 使用正确的JSON格式
JSON_PAYLOAD=$(cat <<EOF
[
  {
    "name": "MINIMAX_API_KEY",
    "value": "${MINIMAX_API_KEY}"
  },
  {
    "name": "MINIMAX_GROUP_ID",
    "value": "${MINIMAX_GROUP_ID}"
  }
]
EOF
)

RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}\n" -X POST \
  "https://api.supabase.com/v1/projects/${PROJECT_ID}/secrets" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "$JSON_PAYLOAD")

echo "$RESPONSE"

echo ""
echo "=== 步骤3: 等待Secrets生效 ==="
sleep 5

echo "完成"
