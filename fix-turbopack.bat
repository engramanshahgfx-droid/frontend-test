@echo off
echo Fixing Next.js Turbopack runtime error...

echo Removing .next directory...
if exist ".next" (
    rmdir /s /q ".next"
    echo .next directory removed
) else (
    echo .next directory not found
)

echo Clearing npm cache...
npm cache clean --force

echo Reinstalling dependencies...
npm install

echo Starting development server without Turbopack...
npm run dev

pause