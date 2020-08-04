FROM nginx:alpine
WORKDIR /app
COPY dist.tar .
COPY nginx.vh.conf /etc/nginx/conf.d/default.conf
ENTRYPOINT tar -xzf dist.tar && nginx -g "daemon off;"