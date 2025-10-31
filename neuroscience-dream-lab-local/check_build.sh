#!/bin/bash
echo "检查构建产物..."
ls -lh dist/
echo ""
echo "构建文件数量:"
find dist -type f | wc -l
echo ""
echo "总大小:"
du -sh dist/
