@echo off
rem -- Check if argument is INSTALL or REMOVE

if not ""%1"" == ""INSTALL"" goto remove

"C:\Bitnami\drupal-7.36-0/mysql\bin\mysqld.exe" --install "drupalMySQL" --defaults-file="C:\Bitnami\drupal-7.36-0/mysql\my.ini"

net start "drupalMySQL" >NUL
goto end

:remove
rem -- STOP SERVICES BEFORE REMOVING

net stop "drupalMySQL" >NUL
"C:\Bitnami\drupal-7.36-0/mysql\bin\mysqld.exe" --remove "drupalMySQL"

:end
exit
