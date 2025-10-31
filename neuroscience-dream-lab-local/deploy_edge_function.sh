#!/bin/bash
set -e

cd /workspace/neuroscience-dream-lab

echo "使用Supabase CLI部署Edge Function..."
supabase functions deploy ai-salon-chat --project-ref mvbxxuoonqaomwqdwsmk --no-verify-jwt

echo ""
echo "部署完成"
