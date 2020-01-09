# builder image build

FROM nginx
EXPOSE 3012
COPY ./nginx/default.conf /etc/nginx.conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html
