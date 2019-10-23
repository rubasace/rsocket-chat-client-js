FROM nginx:stable-alpine as production-stage

# make the 'app' folder the current working directory
WORKDIR /app

COPY dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]