@echo off
echo ========================================
echo   Push E1 News to GitHub
echo ========================================
echo.
echo BEFORE running this:
echo 1. Create GitHub repository named: e1-news-platform
echo 2. Make sure it's PUBLIC (for free hosting)
echo 3. Get your GitHub username ready
echo.
set /p USERNAME="Enter your GitHub username: "
echo.
echo Initializing git...
git init
echo.
echo Adding files...
git add .
echo.
echo Creating commit...
git commit -m "Initial commit - E1 News Platform (Website Only)"
echo.
echo Setting up remote...
git branch -M main
git remote add origin https://github.com/%USERNAME%/e1-news-platform.git
echo.
echo Pushing to GitHub...
git push -u origin main
echo.
echo ========================================
echo   Done!
echo ========================================
echo.
echo Your code is now on GitHub!
echo Next: Go to https://render.com to deploy
echo.
pause

