FROM nginx:stable-alpine as production-stage

# make the 'app' folder the current working directory
WORKDIR /app

COPY dist /usr/share/nginx/html
COPY entrypoint.sh /app/entrypoint.sh

EXPOSE 80
ENTRYPOINT ["sh", "entrypoint.sh"]
