@ECHO OFF
:: Quickly make the public release version of the map,
:: instead manually substituting `<script></script>`

:: Stream the `main.js` line by line
:: If the external JS placeholders do not appear in the line, output ECHO
:: If the placeholders do appear, TYPE `JS-File`
SET sed=%USERPROFILE%\Documents\coreutils\bin\sed.exe -E
SET grep=%USERPROFILE%\Documents\coreutils\bin\grep.exe -E

%sed% -e '/<script src="main.js"><\/script>/'

FOR /F "DELIMS=" %%P IN (index.html) DO (
  IF /I %%P == "  <script src=\".\/main.js\"><\/script>" (ECHO %%P)
)
