# API
FROM node:10.16-alpine as api

WORKDIR /usr/app/api

COPY ./api/package.json ./
RUN yarn install

COPY ./api .

CMD ["yarn", "start"]

# Client
FROM node:10.16-alpine as client

WORKDIR /usr/app/client

COPY ./client/package.json ./
RUN yarn install

COPY ./client .

CMD ["yarn", "build"]

# Final image
FROM alpine:3.10

# FIXME: might not actuall need ncurses-libs
RUN apk add --update runit nodejs npm haproxy ncurses-libs && \ 
    rm -rf /var/cache/apk/*

ADD etc/service  /etc/service
ADD etc/haproxy  /etc/haproxy

EXPOSE 3050
ENTRYPOINT ["/sbin/runsvdir", "/etc/service"]