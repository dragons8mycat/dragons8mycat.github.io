@echo off
rem START or STOP Apache Service
rem --------------------------------------------------------
rem Check if argument is STOP or START

if not ""%1"" == ""START"" goto stop

net start drupalApache
goto end

:stop

"C:/Bitnami/drupal-7.36-0/apache2\bin\httpd.exe" -n "drupalApache" -k stop

:end
exit
