# API
FROM node:10.16-alpine as api

WORKDIR /usr/app

RUN mkdir ./api
COPY ./api/package.json ./api
RUN yarn install

COPY ./api ./api

RUN yarn start

# Client
FROM node:10.16-alpine as client

WORKDIR /usr/app

RUN mkdir ./client
COPY ./client/package.json ./client
RUN yarn install

COPY ./client ./client

RUN yarn build

# Client - nginx
FROM nginx
EXPOSE 3012
COPY ./client/nginx/default.conf ./client/etc/nginx/conf.d/default.conf
COPY --from=client /usr/app/client/build /usr/share/nginx/html

# Nginx routing
FROM nginx
COPY ./nginx/default.conf ./nginx/etc/nginx/conf.d/default.conf
