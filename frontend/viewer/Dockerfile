FROM node:11 as builder

WORKDIR /usr/src/app
COPY frontend/insurance/package*.json ./
RUN npm ci

COPY types /usr/types
COPY frontend/viewer ./
RUN  npm run build

FROM node:alpine

WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/build ./build
RUN npm install -g serve \
    && serve build
