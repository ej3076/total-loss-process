FROM node:11 as builder
ARG api_port=8080

WORKDIR /usr/src/app
COPY frontend/package*.json ./
RUN npm ci

COPY types /usr/src/types
COPY frontend ./
RUN sed -i \
        's/localhost:8080/localhost:'"$api_port"'/' \
        ./src/environments/environment.prod.ts \
    && npm run build

FROM nginx:alpine
WORKDIR /usr/share/nginx/html
COPY etc/nginx/conf.d /etc/nginx/conf.d/
COPY --from=builder /usr/src/app/dist/frontend ./
