FROM node:14 as base

WORKDIR /code

COPY ./package*.json ./
RUN npm install

COPY . .
EXPOSE 3000

FROM base as dev
CMD npm run develop

FROM base as prod
RUN npm run build
CMD node dist/main.js
