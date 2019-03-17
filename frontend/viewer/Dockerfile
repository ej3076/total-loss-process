FROM node:11 as builder
ARG api_port=8081
ARG ws_port=8009

WORKDIR /usr/src/app
COPY frontend/viewer/package*.json ./
RUN npm ci

COPY types /usr/types
COPY frontend/viewer ./
RUN  REACT_APP_API_PORT=${api_port} REACT_APP_WS_PORT=${ws_port} npm run build

FROM node:alpine
ENV PORT 80

RUN npm install -g serve
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/build ./build

CMD ["serve", "-s", "build"]
