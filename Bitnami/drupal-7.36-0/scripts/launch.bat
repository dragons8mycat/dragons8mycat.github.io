@echo off
CALL C:\Bitnami\DRUPAL~1.36-\scripts\setenv.bat
START /MIN "Bitnami Drupal Stack Environment" CMD /C %*
                    