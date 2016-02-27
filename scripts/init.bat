SETLOCAL 
set appPath=%1

:: Create a Meteor app
call meteor create "%appPath%" --release 1.3-beta.11

cd  %1

:: Remove the default files genereated by Meteor
del /s /q /f *.css
del /s /q /f *.html
del /s /q /f *.js

:: Add package dependencies
echo kadira:flow-router >> .meteor/packages
echo aldeed:collection2 >> .meteor/packages
