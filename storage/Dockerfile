FROM node:20-alpine
WORKDIR /app
COPY ./server.js ./server.js
COPY ./package-lock.json ./package-lock.json
COPY ./package.json ./package.json

RUN npm ci

RUN mkdir storage

EXPOSE 3000

CMD ["node", "server.js"]