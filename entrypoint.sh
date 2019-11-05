envsubst </usr/share/nginx/html/env.template.js >/usr/share/nginx/html/env.js
rm /usr/share/nginx/html/env.template.js

nginx -g "daemon off;"
