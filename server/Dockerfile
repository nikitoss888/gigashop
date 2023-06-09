FROM node:18.9.0-alpine3.16 as development
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18.9.0-alpine3.16 as production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=development /usr/src/app/dist ./dist
CMD ["node", "dist/index.js"]