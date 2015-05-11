@echo off
"C:\Bitnami\drupal-7.36-0/mysql\bin\mysql.exe" --defaults-file="C:\Bitnami\drupal-7.36-0/mysql\my.ini" -u root -e "UPDATE mysql.user SET Password=password('%1') WHERE User='root';"
"C:\Bitnami\drupal-7.36-0/mysql\bin\mysql.exe" --defaults-file="C:\Bitnami\drupal-7.36-0/mysql\my.ini" -u root -e "UPDATE mysql.user SET Password=password('%1') WHERE User='';"
"C:\Bitnami\drupal-7.36-0/mysql\bin\mysql.exe" --defaults-file="C:\Bitnami\drupal-7.36-0/mysql\my.ini" -u root -e "FLUSH PRIVILEGES;"
