FROM harbor.patozon.net/library/web/nginx

ADD ./dist /usr/share/nginx/html
ADD ./nginx.conf /etc/nginx/nginx.conf
ADD ./default.conf /etc/nginx/conf.d/default.conf