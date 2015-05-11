@echo off
rem START or STOP Services
rem ----------------------------------
rem Check if argument is STOP or START

if not ""%1"" == ""START"" goto stop

if exist C:\Bitnami\DRUPAL~1.36-\hypersonic\scripts\servicerun.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\server\hsql-sample-database\scripts\servicerun.bat START)
if exist C:\Bitnami\DRUPAL~1.36-\ingres\scripts\servicerun.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\ingres\scripts\servicerun.bat START)
if exist C:\Bitnami\DRUPAL~1.36-\mysql\scripts\servicerun.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\mysql\scripts\servicerun.bat START)
if exist C:\Bitnami\DRUPAL~1.36-\postgresql\scripts\servicerun.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\postgresql\scripts\servicerun.bat START)
if exist C:\Bitnami\DRUPAL~1.36-\elasticsearch\scripts\servicerun.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\elasticsearch\scripts\servicerun.bat START)
if exist C:\Bitnami\DRUPAL~1.36-\logstash\scripts\servicerun.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\logstash\scripts\servicerun.bat START)
if exist C:\Bitnami\DRUPAL~1.36-\logstash-forwarder\scripts\servicerun.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\logstash-forwarder\scripts\servicerun.bat START)
if exist C:\Bitnami\DRUPAL~1.36-\apache2\scripts\servicerun.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\apache2\scripts\servicerun.bat START)
if exist C:\Bitnami\DRUPAL~1.36-\openoffice\scripts\servicerun.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\openoffice\scripts\servicerun.bat START)
if exist C:\Bitnami\DRUPAL~1.36-\apache-tomcat\scripts\servicerun.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\apache-tomcat\scripts\servicerun.bat START)
if exist C:\Bitnami\DRUPAL~1.36-\resin\scripts\servicerun.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\resin\scripts\servicerun.bat START)
if exist C:\Bitnami\DRUPAL~1.36-\activemq\scripts\servicerun.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\activemq\scripts\servicerun.bat START)
if exist C:\Bitnami\DRUPAL~1.36-\jboss\scripts\servicerun.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\jboss\scripts\servicerun.bat START)
if exist C:\Bitnami\DRUPAL~1.36-\wildfly\scripts\servicerun.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\wildfly\scripts\servicerun.bat START)
if exist C:\Bitnami\DRUPAL~1.36-\jetty\scripts\servicerun.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\jetty\scripts\servicerun.bat START)
if exist C:\Bitnami\DRUPAL~1.36-\subversion\scripts\servicerun.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\subversion\scripts\servicerun.bat START)
rem RUBY_APPLICATION_START
if exist C:\Bitnami\DRUPAL~1.36-\lucene\scripts\servicerun.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\lucene\scripts\servicerun.bat START)
if exist C:\Bitnami\DRUPAL~1.36-\mongodb\scripts\servicerun.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\mongodb\scripts\servicerun.bat START)
if exist C:\Bitnami\DRUPAL~1.36-\third_application\scripts\servicerun.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\third_application\scripts\servicerun.bat START)
goto end

:stop
echo "Stopping services ..."
if exist C:\Bitnami\DRUPAL~1.36-\third_application\scripts\servicerun.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\third_application\scripts\servicerun.bat STOP)
if exist C:\Bitnami\DRUPAL~1.36-\lucene\scripts\servicerun.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\lucene\scripts\servicerun.bat STOP)
rem RUBY_APPLICATION_STOP
if exist C:\Bitnami\DRUPAL~1.36-\subversion\scripts\servicerun.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\subversion\scripts\servicerun.bat STOP)
if exist C:\Bitnami\DRUPAL~1.36-\jetty\scripts\servicerun.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\jetty\scripts\servicerun.bat STOP)
if exist C:\Bitnami\DRUPAL~1.36-\hypersonic\scripts\servicerun.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\server\hsql-sample-database\scripts\servicerun.bat STOP)
if exist C:\Bitnami\DRUPAL~1.36-\jboss\scripts\servicerun.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\jboss\scripts\servicerun.bat STOP)
if exist C:\Bitnami\DRUPAL~1.36-\wildfly\scripts\servicerun.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\wildfly\scripts\servicerun.bat STOP)
if exist C:\Bitnami\DRUPAL~1.36-\resin\scripts\servicerun.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\resin\scripts\servicerun.bat STOP)
if exist C:\Bitnami\DRUPAL~1.36-\activemq\scripts\servicerun.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\activemq\scripts\servicerun.bat STOP)
if exist C:\Bitnami\DRUPAL~1.36-\apache-tomcat\scripts\servicerun.bat (start /MIN /WAIT C:\Bitnami\DRUPAL~1.36-\apache-tomcat\scripts\servicerun.bat STOP)
if exist C:\Bitnami\DRUPAL~1.36-\openoffice\scripts\servicerun.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\openoffice\scripts\servicerun.bat STOP)
if exist C:\Bitnami\DRUPAL~1.36-\apache2\scripts\servicerun.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\apache2\scripts\servicerun.bat STOP)
if exist C:\Bitnami\DRUPAL~1.36-\logstash-forwarder\scripts\servicerun.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\logstash-forwarder\scripts\servicerun.bat STOP)
if exist C:\Bitnami\DRUPAL~1.36-\logstash\scripts\servicerun.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\logstash\scripts\servicerun.bat STOP)
if exist C:\Bitnami\DRUPAL~1.36-\elasticsearch\scripts\servicerun.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\elasticsearch\scripts\servicerun.bat STOP)
if exist C:\Bitnami\DRUPAL~1.36-\ingres\scripts\servicerun.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\ingres\scripts\servicerun.bat STOP)
if exist C:\Bitnami\DRUPAL~1.36-\mysql\scripts\servicerun.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\mysql\scripts\servicerun.bat STOP)
if exist C:\Bitnami\DRUPAL~1.36-\mongodb\scripts\servicerun.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\mongodb\scripts\servicerun.bat STOP)
if exist C:\Bitnami\DRUPAL~1.36-\postgresql\scripts\servicerun.bat (start /MIN C:\Bitnami\DRUPAL~1.36-\postgresql\scripts\servicerun.bat STOP)

:end
