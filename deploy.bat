@echo off
echo 正在部署 Data Beauty Lab 到 Vercel...

cd /d "D:\hugo_morefine\data-beauty-lab"

REM 1. 生成静态文件
hugo --gc --minify

REM 2. 推送到GitHub（触发Vercel自动部署）
git add .
git commit -m "更新: %date% %time%"
git push origin main

echo 部署完成！Vercel会自动构建并发布到 139010.xyz
echo 查看进度：https://vercel.com/twoken404s-projects/data-beauty-lab
pause