@echo off
echo ===== SecQuiz Vercel Deployment Script =====
echo.

echo Step 1: Building the application...
call npm run vercel-build
if %ERRORLEVEL% neq 0 (
  echo Error: Build failed!
  exit /b %ERRORLEVEL%
)
echo Build successful!
echo.

echo Step 2: Deploying to Vercel...
call vercel --prod
if %ERRORLEVEL% neq 0 (
  echo Error: Deployment failed!
  exit /b %ERRORLEVEL%
)
echo.
echo Deployment successful! Your app should be live at https://secquiz-elite.vercel.app/
echo.

echo If you still experience issues, try the following:
echo 1. Check the Vercel dashboard for build logs
echo 2. Make sure all environment variables are set in the Vercel dashboard
echo 3. Try clearing your browser cache or using incognito mode
echo.

pause
