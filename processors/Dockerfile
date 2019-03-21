FROM node:11
ENV NODE_ENV production

WORKDIR /usr/src/utils
COPY utils/package*.json ./
RUN npm ci

WORKDIR /usr/src/app
COPY processors/package*.json ./
RUN npm ci

COPY protos /usr/src/protos
COPY processors/src src
COPY utils /usr/src/utils
