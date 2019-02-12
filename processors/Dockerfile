FROM node:11

WORKDIR /usr/src/app

COPY processors/package*.json ./

RUN npm ci --only=production

COPY protos /usr/src/protos
COPY processors/src src
