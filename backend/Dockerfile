FROM node:14 as base

WORKDIR /srv/app

COPY ./package*.json ./
RUN npm install

COPY . .
EXPOSE 1337

FROM base as dev
CMD npm run develop

FROM base as prod
RUN npm run build
CMD npm run start
