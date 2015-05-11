@echo off
rem -- Check if argument is INSTALL or REMOVE

if not ""%1"" == ""INSTALL"" goto remove

if exist C:\Bitnami\DRUPAL~1.36-\mysql\scripts\serviceinstall.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\mysql\scripts\serviceinstall.bat INSTALL)
if exist C:\Bitnami\DRUPAL~1.36-\postgresql\scripts\serviceinstall.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\postgresql\scripts\serviceinstall.bat INSTALL)
if exist C:\Bitnami\DRUPAL~1.36-\elasticsearch\scripts\serviceinstall.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\elasticsearch\scripts\serviceinstall.bat INSTALL)
if exist C:\Bitnami\DRUPAL~1.36-\logstash\scripts\serviceinstall.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\logstash\scripts\serviceinstall.bat INSTALL)
if exist C:\Bitnami\DRUPAL~1.36-\logstash-forwarder\scripts\serviceinstall.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\logstash-forwarder\scripts\serviceinstall.bat INSTALL)
if exist C:\Bitnami\DRUPAL~1.36-\apache2\scripts\serviceinstall.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\apache2\scripts\serviceinstall.bat INSTALL)
if exist C:\Bitnami\DRUPAL~1.36-\apache-tomcat\scripts\serviceinstall.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\apache-tomcat\scripts\serviceinstall.bat INSTALL)
if exist C:\Bitnami\DRUPAL~1.36-\resin\scripts\serviceinstall.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\resin\scripts\serviceinstall.bat INSTALL)
if exist C:\Bitnami\DRUPAL~1.36-\jboss\scripts\serviceinstall.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\jboss\scripts\serviceinstall.bat INSTALL)
if exist C:\Bitnami\DRUPAL~1.36-\wildfly\scripts\serviceinstall.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\wildfly\scripts\serviceinstall.bat INSTALL)
if exist C:\Bitnami\DRUPAL~1.36-\activemq\scripts\serviceinstall.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\activemq\scripts\serviceinstall.bat INSTALL)
if exist C:\Bitnami\DRUPAL~1.36-\openoffice\scripts\serviceinstall.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\openoffice\scripts\serviceinstall.bat INSTALL)
if exist C:\Bitnami\DRUPAL~1.36-\subversion\scripts\serviceinstall.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\subversion\scripts\serviceinstall.bat INSTALL)
rem RUBY_APPLICATION_INSTALL
if exist C:\Bitnami\DRUPAL~1.36-\mongodb\scripts\serviceinstall.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\mongodb\scripts\serviceinstall.bat INSTALL)
if exist C:\Bitnami\DRUPAL~1.36-\lucene\scripts\serviceinstall.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\lucene\scripts\serviceinstall.bat INSTALL)
if exist C:\Bitnami\DRUPAL~1.36-\third_application\scripts\serviceinstall.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\third_application\scripts\serviceinstall.bat INSTALL)
if exist C:\Bitnami\DRUPAL~1.36-\nginx\scripts\serviceinstall.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\nginx\scripts\serviceinstall.bat INSTALL)
if exist C:\Bitnami\DRUPAL~1.36-\php\scripts\serviceinstall.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\php\scripts\serviceinstall.bat INSTALL)
goto end

:remove

if exist C:\Bitnami\DRUPAL~1.36-\third_application\scripts\serviceinstall.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\third_application\scripts\serviceinstall.bat)
if exist C:\Bitnami\DRUPAL~1.36-\lucene\scripts\serviceinstall.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\lucene\scripts\serviceinstall.bat)
if exist C:\Bitnami\DRUPAL~1.36-\mongodb\scripts\serviceinstall.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\mongodb\scripts\serviceinstall.bat)
rem RUBY_APPLICATION_REMOVE
if exist C:\Bitnami\DRUPAL~1.36-\subversion\scripts\serviceinstall.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\subversion\scripts\serviceinstall.bat)
if exist C:\Bitnami\DRUPAL~1.36-\openoffice\scripts\serviceinstall.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\openoffice\scripts\serviceinstall.bat)
if exist C:\Bitnami\DRUPAL~1.36-\jboss\scripts\serviceinstall.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\jboss\scripts\serviceinstall.bat)
if exist C:\Bitnami\DRUPAL~1.36-\wildfly\scripts\serviceinstall.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\wildfly\scripts\serviceinstall.bat)
if exist C:\Bitnami\DRUPAL~1.36-\resin\scripts\serviceinstall.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\resin\scripts\serviceinstall.bat)
if exist C:\Bitnami\DRUPAL~1.36-\activemq\scripts\serviceinstall.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\activemq\scripts\serviceinstall.bat)
if exist C:\Bitnami\DRUPAL~1.36-\apache-tomcat\scripts\serviceinstall.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\apache-tomcat\scripts\serviceinstall.bat)
if exist C:\Bitnami\DRUPAL~1.36-\apache2\scripts\serviceinstall.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\apache2\scripts\serviceinstall.bat)
if exist C:\Bitnami\DRUPAL~1.36-\logstash-forwarder\scripts\serviceinstall.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\logstash-forwarder\scripts\serviceinstall.bat)
if exist C:\Bitnami\DRUPAL~1.36-\logstash\scripts\serviceinstall.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\logstash\scripts\serviceinstall.bat)
if exist C:\Bitnami\DRUPAL~1.36-\elasticsearch\scripts\serviceinstall.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\elasticsearch\scripts\serviceinstall.bat)
if exist C:\Bitnami\DRUPAL~1.36-\postgresql\scripts\serviceinstall.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\postgresql\scripts\serviceinstall.bat)
if exist C:\Bitnami\DRUPAL~1.36-\mysql\scripts\serviceinstall.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\mysql\scripts\serviceinstall.bat)
if exist C:\Bitnami\DRUPAL~1.36-\php\scripts\serviceinstall.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\php\scripts\serviceinstall.bat)
if exist C:\Bitnami\DRUPAL~1.36-\nginx\scripts\serviceinstall.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\nginx\scripts\serviceinstall.bat)
:end
