FROM node:20-alpine AS build-env

COPY ./ /app/
WORKDIR /app
RUN npm ci
RUN npm run build

FROM node:20-alpine

COPY --from=build-env /app/dist /app/dist
COPY --from=build-env /app/node_modules /app/node_modules
ENV PORT=80

EXPOSE 80

WORKDIR /app

CMD ["node", "dist/server.js"]