@echo off
rem -- Check if argument is INSTALL or REMOVE

if not ""%1"" == ""INSTALL"" goto remove

"C:/Bitnami/drupal-7.36-0/apache2\bin\httpd.exe" -k install -n "drupalApache" -f "C:/Bitnami/drupal-7.36-0/apache2\conf\httpd.conf"

net start drupalApache >NUL
goto end

:remove
rem -- STOP SERVICE BEFORE REMOVING

net stop drupalApache >NUL
"C:/Bitnami/drupal-7.36-0/apache2\bin\httpd.exe" -k uninstall -n "drupalApache"

:end
exit
