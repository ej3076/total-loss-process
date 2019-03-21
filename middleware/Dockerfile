FROM node:11
ENV NODE_ENV production

WORKDIR /usr/src/utils
COPY utils/package*.json ./
RUN npm ci

WORKDIR /usr/src/app
COPY middleware/package*.json ./
RUN npm ci

COPY middleware .
COPY protos /usr/src/protos
COPY utils /usr/src/utils
