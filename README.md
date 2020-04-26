# Magpay

Application to generate pay slips for Magbelle Hair Salon employees

## How

```bash
docker-compose up # site available at localhost:3050
```

Client runs on port 3012

API runs on port 8001

## To do
- [] close sidebar if im on homepage and i click on homepage (currently theres no feedback if youre on the same page)
- [] privateroute to actually work
- [] info not being passed through to pdf blob
- [] remove client dependency on api (logincheck)
- [] code validation
- [] NaNs in the pdf
- [] handle 404
- [] use https only