# API
FROM node:10.16-alpine as api

WORKDIR /usr/app/api

COPY ./package.json ./
RUN yarn install

COPY . .

RUN yarn start

# Client
FROM node:10.16-alpine as client

WORKDIR /usr/app/client

COPY ./package.json ./
RUN yarn install

COPY . .

RUN yarn build

# Client - nginx
FROM nginx
EXPOSE 3012
COPY ./client/nginx/default.conf ./client/etc/nginx/conf.d/default.conf
COPY --from=client /usr/app/client/build /usr/share/nginx/html

# Nginx routing
FROM nginx
COPY ./nginx/default.conf ./nginx/etc/nginx/conf.d/default.conf
