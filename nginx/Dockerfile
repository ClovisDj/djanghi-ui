FROM nginx:1.21-alpine

RUN rm /etc/nginx/conf.d/default.conf
RUN rm /usr/share/nginx/html/*

COPY nginx.conf /etc/nginx/conf.d

EXPOSE 80
