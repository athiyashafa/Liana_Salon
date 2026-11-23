@echo off
chcp 65001 >nul
title Liana Salon - Pasang ke XAMPP
echo ============================================
echo   Liana Salon: bangun aplikasi dan pasang ke XAMPP
echo ============================================
echo.

set "XAMPP=C:\xampp"
if exist "%XAMPP%\htdocs" goto lokasiOke
echo Folder XAMPP tidak ditemukan di C:\xampp.
set /p XAMPP=Ketik lokasi folder XAMPP Anda, contoh D:\xampp : 
if exist "%XAMPP%\htdocs" goto lokasiOke
echo Folder htdocs tidak ditemukan di "%XAMPP%".
goto gagal

:lokasiOke
set "TUJUAN=%XAMPP%\htdocs\liana-salon"

echo [1/3] Memasang paket (butuh internet, pertama kali agak lama)...
call npm install
if errorlevel 1 goto gagal

echo.
echo [2/3] Membangun aplikasi...
call npm run build
if errorlevel 1 goto gagal

echo.
echo [3/3] Menyalin ke %TUJUAN% ...
if exist "%TUJUAN%\api\config.php" copy /Y "%TUJUAN%\api\config.php" "%TEMP%\liana-config.php" >nul
xcopy "api" "%TUJUAN%\api\" /E /I /Y /Q >nul
if exist "%TEMP%\liana-config.php" copy /Y "%TEMP%\liana-config.php" "%TUJUAN%\api\config.php" >nul
copy /Y "dist\index.html" "%TUJUAN%\index.html" >nul

echo.
echo Selesai.
echo  - Pastikan Apache dan MySQL di XAMPP sudah Start.
echo  - Alamat aplikasi : https://localhost/liana-salon/
echo    (jika muncul peringatan sertifikat, pilih Lanjutkan/Advanced lalu Proceed)
echo  - Atau tanpa peringatan: http://localhost/liana-salon/
echo  - Berkas dist\index.html juga bisa dibuka langsung dengan klik dua kali.
echo.
start "" "http://localhost/liana-salon/"
goto akhir

:gagal
echo.
echo Gagal. Pastikan Node.js terpasang, komputer terhubung ke internet untuk npm install,
echo dan lokasi folder XAMPP benar.

:akhir
pause
