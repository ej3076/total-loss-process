FROM node:11 as builder
ARG api_port=8080

WORKDIR /usr/src/app
COPY frontend/insurance/package*.json ./
RUN npm ci

COPY types /usr/types
COPY frontend/insurance ./
RUN sed -i \
        's/localhost:8080/localhost:'"$api_port"'/' \
        ./src/environments/environment.prod.ts \
    && npm run build

FROM node:alpine
ENV PORT 80

RUN npm install -g serve
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/dist/frontend ./build

CMD ["serve", "-s", "build"]
