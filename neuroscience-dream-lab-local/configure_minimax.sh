#!/bin/bash
set -e

# 从get_all_secrets获取的环境变量
MINIMAX_KEY="${MINIMAX_API_KEY}"
MINIMAX_GID="${MINIMAX_GROUP_ID}"

echo "检查MiniMax配置..."
echo "API Key长度: ${#MINIMAX_KEY}"
echo "Group ID: ${MINIMAX_GID}"

if [ -z "$MINIMAX_KEY" ]; then
    echo "错误: MINIMAX_API_KEY环境变量为空！"
    exit 1
fi

# 使用curl设置Supabase secrets
PROJECT_ID="mvbxxuoonqaomwqdwsmk"
ACCESS_TOKEN="sbp_oauth_03dace1baf0e314d3157a885680723c857d2c337"

echo ""
echo "正在配置Supabase Secrets..."

# 使用正确的JSON格式
PAYLOAD=$(cat <<EOF
[
  {"name": "MINIMAX_API_KEY", "value": "${MINIMAX_KEY}"},
  {"name": "MINIMAX_GROUP_ID", "value": "${MINIMAX_GID}"}
]
EOF
)

# 发送请求
RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST \
  "https://api.supabase.com/v1/projects/${PROJECT_ID}/secrets" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD")

echo "$RESPONSE"

echo ""
echo "配置完成，等待生效..."
sleep 5
