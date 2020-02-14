ARG ALPINE_VERSION=3.10

# API
FROM node:10.19-alpine as api

WORKDIR /usr/app/api

COPY ./api/package.json ./
RUN yarn install

COPY ./api .

CMD ["yarn", "start"]

# Client
FROM node:10.19-alpine as client

WORKDIR /usr/app/client

COPY ./client/package.json ./
RUN yarn install

COPY ./client .

CMD ["yarn", "build"]

# Final image
FROM alpine:3.10

# FIXME: might not actually need ncurses-libs
RUN apk add --update runit nodejs yarn haproxy && \ 
    rm -rf /var/cache/apk/*

COPY etc/service  /etc/service
COPY etc/haproxy  /etc/haproxy

COPY --from=api /usr/app/api /usr/app/api
COPY --from=client /usr/app/client /usr/app/client

EXPOSE 3050
ENTRYPOINT ["/sbin/runsvdir", "/etc/service"]