@ECHO OFF
:: Quickly make the public release version of the map,
:: instead manually substituting `<script></script>`
FOR /F "DELIMS=" %%P IN (index.html) DO (
  IF /I %%P == "  <script src=\".\/main.js\"><\/script>" (ECHO %%P)
)
