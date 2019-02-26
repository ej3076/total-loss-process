FROM node:11
ENV NODE_ENV production

WORKDIR /usr/src/app
COPY middleware/package*.json ./

RUN npm ci

COPY protos /usr/src/protos
COPY middleware .
