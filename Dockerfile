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

# Client - nginx
FROM nginx
COPY ./client/nginx/default.conf ./usr/app/client/etc/nginx/conf.d/default.conf
COPY --from=client /usr/app/client/build /usr/share/nginx/html
EXPOSE 3012

# Nginx routing
FROM nginx
COPY ./nginx/default.conf ./etc/nginx/conf.d/default.conf
